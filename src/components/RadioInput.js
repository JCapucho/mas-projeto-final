import { RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'

function RadioOption({ data, render }) {
    const renderData = render(data);

    return <RadioGroup.Option
        value={data}
        className={({ active, checked }) =>
            `${
                active
                ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                : ''
            }
            ${
                checked ? 'bg-sky-900 bg-opacity-75 text-white' : 'bg-white'
            }
            relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
        }
    >
        {({ active, checked }) => (
        <>
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                    <div className="text-sm">
                        <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? 'text-white' : 'text-gray-900'
                            }`}
                        >
                            {renderData.label}
                        </RadioGroup.Label>
                        {renderData.description && <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? 'text-sky-100' : 'text-gray-500'
                            }`}
                        >
                            {renderData.description}
                        </RadioGroup.Description>}
                    </div>
                </div>
                {checked && (
                    <div className="shrink-0 text-white">
                        <CheckIcon className="h-6 w-6" />
                    </div>
                )}
            </div>
        </>
    )}
    </RadioGroup.Option>;
}

export default function RadioInput({ label, selected, onChange, options, render, className, ...rest }) {
    return <RadioGroup value={selected} onChange={onChange} className={className} {...rest}>
        <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label>
        <div className="space-y-2">
            {options.map((option, i) => <RadioOption key={i} data={option} render={render} />)}
        </div>
    </RadioGroup>;
}
