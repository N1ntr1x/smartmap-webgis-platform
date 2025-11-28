import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

// Definisce tutti gli stili e le varianti dei bottoni del tuo progetto
const buttonVariants = cva(
  // Stili di base, applicati a TUTTI i bottoni
  "inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-400 cursor-pointer",
  {
    variants: {
      // varianti (colore e stile)
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700 rounded-lg",
        destructive: "bg-red-600 text-white hover:bg-red-700 rounded-lg",
        success: "bg-green-600 text-white hover:bg-green-700 rounded-lg",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg",
        button: "bg-transparent text-gray-600 hover:text-red-600",
        "map-button": "bg-white shadow-md hover:bg-gray-100",
        normal: "bg-transparent",
        ghost: "bg-transparent text-gray-600 hover:text-gray-800",
        link: "bg-transparent text-blue-600 hover:underline",
      },
      // varianti dimensione
      size: {
        auto: "w-auto h-auto",
        default: "h-10 px-4 py-2 text-sm",
        xs: "p-2 text-xs",
        sm: "h-9 px-2.5 py-1.5 text-sm",
        lg: "h-11 px-6 py-3 text-base",
        icon: "h-4 w-4",
        "icon-sm": "h-6 w-6",
        "icon-md": "h-8 w-8",
        "icon-lg": "h-10 w-10",
        "icon-xl": "h-12 w-12",
      },
    },
    // Valori di default se non specificati
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

/* Estende ButtonHTMLAttributes<HTMLButtonElement> per ereditare tutte le props native di <button> ed
   estende VariantProps<typeof buttonVariants> (generato da cva) per ottenere automaticamente
   i tipi corrispondenti alle varianti dichiarate in `buttonVariants`.
*/
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { }

// Componente Button:
// - Utilizza forwardRef per permettere ai componenti genitori di ottenere il ref del button
// - Destructura className, variant e size per generare la stringa di classi corretta tramite `buttonVariants`.
// - `twMerge` viene usato per unire/normalizzare le classi generate con eventuali classi custom passate
//   tramite la prop `className`, evitando conflitti o duplicazioni di classi Tailwind.
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
      // cva() genera la stringa di classi corretta in base alle props
      <button
        className={twMerge(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
);
Button.displayName = "Button";

export default Button;
export { buttonVariants };