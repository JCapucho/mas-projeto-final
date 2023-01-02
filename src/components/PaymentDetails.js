import { useFormContext } from "react-hook-form";

import FormLabel from "./FormLabel";
import FormInput from "./FormInput";

export default function PaymentDetails() {
    const { register, formState: { errors } } = useFormContext();

    return <>
        <div className="mb-3">
            <FormLabel>Card information</FormLabel>
            <FormInput
                type="tel"
                placeholder="1234 1234 1234 1234"
                autoComplete="cc-number"
                register={() => register("cardNumber", {
                    required: true,
                    pattern: /[0-9\s]{13,19}/,
                })}
                className={[
                    "rounded-b-none",
                    errors.cardNumber && "border-red-500"
                ]}
                aria-invalid={errors.cardNumber ? "true" : "false"} 
                onKeyPress={(e) => {
                    const good = e.target.value.length < 19
                        && (e.key === ' ' || (e.key >= '0' && e.key <= '9'));
                    if (!good) e.preventDefault();
                }}
                />
            <div className="flex">
                <FormInput
                    type="tel"
                    placeholder="MM/YY"
                    register={() => register("cardExp", { required: true })}
                    className={[
                        "mt-0 rounded-t-none rounded-r-none border-t-0",
                        errors.cardExp && "border-red-500"
                    ]}
                    aria-invalid={errors.cardExp ? "true" : "false"} 
                    onKeyPress={(e) => {
                        const good = e.target.value.length < 7 && e.key >= '0' && e.key <= '9';
                        if (!good) e.preventDefault();
                    }}
                    onKeyUp={(e) => {
                        const isMonthEntered = /^\d\d$/.exec(e.target.value);
                        if (e.key >= '0' && e.key <= '9' && isMonthEntered)
                            e.target.value = e.target.value + " / ";
                    }}
                    onKeyDown={(e) => {
                        const isMonthAndSlashEntered = /^\d\d \/ $/.exec(e.target.value);
                        if (isMonthAndSlashEntered && e.key === 'Backspace')
                            e.target.value = e.target.value.slice(0, -3);
                    }}
                    />
                <FormInput
                    type="tel"
                    placeholder="CVC"
                    register={() => register("cardSec", { required: true })}
                    className={[
                        "mt-0 rounded-t-none rounded-l-none border-t-0 border-l-0",
                        errors.cardSec && "border-red-500"
                    ]}
                    aria-invalid={errors.cardSec ? "true" : "false"} 
                    onKeyPress={(e) => {
                        const good = e.target.value.length < 4 && e.key >= '0' && e.key <= '9';
                        if (!good) e.preventDefault();
                    }}
                    />
            </div>
        </div>
        <div className="mb-3">
            <FormLabel id="name">Name on card</FormLabel>
            <FormInput
                id="name"
                type="text"
                register={() => register("cardName", { required: true })}
                className={errors.cardName && "border-red-500"}
                aria-invalid={errors.cardName ? "true" : "false"} 
                />
        </div>
    </>;
}
