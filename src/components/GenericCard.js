export default function GenericCard({ name, img, children, header }) {
    return (
        <div className="self-stretch rounded-lg shadow-lg bg-white p-6 w-96 flex flex-col justify-between">
            {header}
            <img 
                className="rounded-t-lg mx-auto"
                style={{ maxHeight: "300px", maxWidth: "300px" }}
                src={img}
                alt={name} />
            <div className="flex justify-center items-center mt-4 flex-col">
                <p className="text-gray-900 text-lg text-center mb-2 mt-4">{name}</p>
                {children}
            </div>
        </div>
    );
}
