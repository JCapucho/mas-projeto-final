import { classNames } from "../utils";

export default function GenericCard({ 
    name,
    img,
    children,
    header,
    className,
    width = "w-96",
    imgWidth = "300px",
    imgHeight = "300px",
    ...rest
}) {
    return (
        <div 
            className={classNames(
                "self-stretch rounded-lg shadow-lg bg-white p-6 flex flex-col justify-between",
                width,
                className
            )}
            {...rest}
        >
            {header}
            <img 
                className="rounded-t-lg mx-auto"
                style={{ maxHeight: imgWidth, maxWidth: imgHeight }}
                src={img}
                alt={name} />
            <div className="flex justify-center items-center mt-4 flex-col">
                <p className="text-gray-900 text-lg text-center mb-2 mt-4">{name}</p>
                {children}
            </div>
        </div>
    );
}
