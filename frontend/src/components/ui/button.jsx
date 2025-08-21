import React from "react";

/**
 * @typedef {Object} ButtonProps
 * @property {string} [variant]
 * @property {string} [size]
 * @property {string} [className]
 * @property {React.ReactNode} [children]
 * @property {any} [rest]
 */

const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-100",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    ghost: "bg-transparent hover:bg-gray-100",
    link: "text-blue-600 underline hover:text-blue-800",
};

const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded px-3",
    lg: "h-11 rounded px-8",
    icon: "h-10 w-10 flex items-center justify-center",
};

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

const Button = React.forwardRef(
    (
        { className, variant = "default", size = "default", children, ...props },
        ref
    ) => (
        <button
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50",
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
            ref={ref}
            {...props}
        >
            {children}
        </button>
    )
);

Button.displayName = "Button";

export { Button };
