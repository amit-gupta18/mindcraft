from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from PIL import Image
import io
import pytesseract
import cv2
import numpy as np
import re
import logging

app = FastAPI()

@app.get("/")
def root():
    return {"message": "PII Masking API running"}

@app.post("/mask_pii/")
async def mask_pii(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    try:
        # loading image 
        image_bytes = await file.read()
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_np = np.array(pil_image)
        img_cv = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
        masked_img = img_cv.copy()

        # OCR with bounding boxes
        ocr_data = pytesseract.image_to_data(img_cv, output_type=pytesseract.Output.DICT)
        n_boxes = len(ocr_data['text'])
        logging.info(f"OCR detected {n_boxes} words")
        raw_text = pytesseract.image_to_string(img_cv)
        # print("\n----- OCR RAW TEXT -----\n")
        # print(raw_text)
        # print("\n-------------------------\n")



        aadhaar_pattern = r'\b\d{4}\D?\d{4}\D?\d{4}\b'
        phone_pattern = r'\b(?:\+91[\s-]?)?[6789]\d{9}\b|\b\d{5}[-\s]?\d{5}\b'
        dob_pattern = r'\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b'
        email_pattern = r'\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b'

        pii_boxes = []


        lines = {}
        for i in range(n_boxes):
            text = ocr_data['text'][i].strip()
            # if text:
            #      print(f"[{i}] {text} @ ({ocr_data['left'][i]}, {ocr_data['top'][i]}, {ocr_data['width'][i]}, {ocr_data['height'][i]})")
            if not text:
                continue

            try:
                conf = int(ocr_data['conf'][i])
            except:
                conf = 0

            if conf < 40:  # skip low confidence
                continue

            line_num = (ocr_data['page_num'][i], ocr_data['block_num'][i],
                        ocr_data['par_num'][i], ocr_data['line_num'][i])

            if line_num not in lines:
                lines[line_num] = {"text": [], "boxes": []}

            x, y, w, h = (
                ocr_data['left'][i],
                ocr_data['top'][i],
                ocr_data['width'][i],
                ocr_data['height'][i],
            )

            lines[line_num]["text"].append(text)
            lines[line_num]["boxes"].append((x, y, w, h))

        # running regex on whole lines
        for line_key, line_data in lines.items():
            line_text = " ".join(line_data["text"])
            if (re.search(aadhaar_pattern, line_text) or
                re.search(phone_pattern, line_text) or
                re.search(dob_pattern, line_text) or
                re.search(email_pattern, line_text)):

                logging.info(f"PII Detected in line: {line_text}")
                pii_boxes.extend(line_data["boxes"])

        # masking the detected regions
        for (x, y, w, h) in pii_boxes:
            cv2.rectangle(masked_img, (x, y), (x + w, y + h), (0, 0, 0), -1)

        logging.info(f"Total PII masked: {len(pii_boxes)}")

        
        # converting the masked PIL to image . 
        masked_pil = Image.fromarray(cv2.cvtColor(masked_img, cv2.COLOR_BGR2RGB))
        buf = io.BytesIO()
        masked_pil.save(buf, format="PNG")
        buf.seek(0)

        return StreamingResponse(buf, media_type="image/png")

    except Exception as e:
        logging.error(f"Processing error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
