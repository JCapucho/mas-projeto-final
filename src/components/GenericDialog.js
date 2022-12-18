import { Dialog } from '@headlessui/react'

export default function GenericDialog({ open, onClose, title, children }) {
    return (
        <Dialog open={open} onClose={onClose}>
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            {/* Full-screen container to center the panel */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                    >
                        {title}
                    </Dialog.Title>

                    {children}
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
