import EmptyModal from "@/Components/Dialogs/EmptyModal";
import {useForm} from "@inertiajs/inertia-react";
import {AdjustmentsHorizontalIcon} from "@heroicons/react/24/outline";

function NewPage({ open, setOpen, collection, app }) {

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        is_singular: false,
        collection_id: collection.id,
        type: '',
        content: [],
        settings: {},
    });

    const [step, setStep] = useState(1);

    return (
        <EmptyModal
            open={open}
            setOpen={setOpen}
            maxWidth={'3xl'}
        >
            <div className="bg-white">
                <div className="py-3 px-4 border-b">
                    <h2 className="text-lg font-bold text-gray-600">New Page</h2>
                </div>

                <div className="p-4">
                    <h2 className="text-2xl text-center font-bold text-gray-600">Select a query relation</h2>
                </div>

                <div className="px-4 pb-4 flex justify-center items-center">
                    <div className="w-1/2 p-8">
                        <div className="flex flex-col items-center rounded-lg transition border border-transparent hover:shadow-lg hover:border-primary-600 p-4 gap-1 group">
                            <AdjustmentsHorizontalIcon className="h-12 w-12 stroke-1 text-gray-400 group-hover:text-primary-300"/>
                            <div className="text-lg font-bold group-hover:text-primary-600">Collection page</div>
                            <p className="text-sm text-gray-400 text-center group-hover:text-primary-300">will display global values for all or part of the collection records</p>
                        </div>
                    </div>
                    <div className="w-1/2 p-8">
                        <div className="flex flex-col items-center rounded-lg transition border border-transparent hover:shadow-lg hover:border-primary-600 p-4 gap-1 group">
                            <AdjustmentsHorizontalIcon className="h-12 w-12 stroke-1 text-gray-400 group-hover:text-primary-300"/>
                            <div className="text-lg font-bold group-hover:text-primary-600">Singular page</div>
                            <p className="text-sm text-gray-400 text-center group-hover:text-primary-300">will display values attributed to one record in the collection</p>
                        </div>
                    </div>
                </div>
            </div>
        </EmptyModal>
    )
}

export default NewPage
