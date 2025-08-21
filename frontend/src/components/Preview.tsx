import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Download } from "lucide-react";

type ImagePreviewProps = {
  originalImageUrl: string | null;
  maskedImageUrl: string | null;
};

export default function Preview({ originalImageUrl, maskedImageUrl }: ImagePreviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/*---------------- Original Image ---------*/}
      {originalImageUrl && (
        <Card className="shadow-lg bg-gradient-to-b from-slate-100 to-slate-300 dark:from-slate-800 dark:to-slate-900">
          <CardHeader>
            <CardTitle>Original Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={originalImageUrl}
                alt="Original document"
                className="w-full h-full object-contain"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/*------------------ Masked Image --------------------*/}

      {maskedImageUrl && (
        <Card className="shadow-lg bg-gradient-to-tr from-cyan-100 to-blue-200 dark:from-cyan-900 dark:to-blue-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Masked Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
              <img
                src={maskedImageUrl}
                alt="Masked document"
                className="w-full h-full object-contain"
              />
            </div>
            <Button
              className="w-full justify-center font-medium text-gray-800 dark:text-gray-100"
              variant="secondary"
              onClick={() => {
                const a = document.createElement("a");
                a.href = maskedImageUrl;
                a.download = "masked-image.png";
                a.click();
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Masked Image
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
