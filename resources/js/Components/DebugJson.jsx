import Card from "@/Components/Widgets/Card";

function DebugJson({ label, json }) {
    return (
        <Card
            className="w-full"
            classNameCard="bg-gray-100"
        >
            <Card.Header
                className="py-2 border-0 font-bold pb-0"
            >
                {label}
            </Card.Header>
            <Card.Body className="p-0">
                <pre className="p-4 text-xs text-gray-500">
                    {JSON.stringify(json, null, 2)}
                </pre>
            </Card.Body>
        </Card>
    );
}

export default DebugJson
