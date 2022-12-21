import Card from "@/Components/Widgets/Card";
import Icon from "@/Components/Icon";
import List from "@/Pages/Admin/Apps/List";

function NumberWidget({ setModal, width, description, bg_color, className, action, label, listData, ...props }) {

    if(props.loading){
        return (
            <Card className={className}>
                <Card.Body>
                    <div className="flex items-center justify-center h-full">
                        <Icon icon="spinner" spin/>
                    </div>
                </Card.Body>
            </Card>
        )
    }

    const colorClass = color => ({
        'primary': 'text-primary-100 fill-primary-400, stroke-primary-300 bg-primary-50',
        'secondary': 'fill-secondary-100, stroke-secondary-400 text-secondary-100 bg-secondary-50',
        'success': 'fill-success-100, stroke-success-400 text-success-100 bg-success-50',
        'danger': 'fill-danger-100, stroke-danger-400 text-danger-100 bg-danger-50',
        'warning': 'fill-warning-100, stroke-warning-400 text-warning-100 bg-warning-50',
        'info': 'fill-info-100, stroke-info-400 text-info-100 bg-info-50',
    }[color]);

    const cardClasses = color => ({
        'primary': 'bg-primary-50',
        'secondary': 'bg-secondary-50',
        'success': 'bg-success-50',
        'danger': 'bg-danger-50',
        'warning': 'bg-warning-50',
        'info': 'bg-info-50',
    }[color]);

    return (
        <Card
            className={`${className ?? ''}`}
            classNameCard={cardClasses(bg_color)}
        >
            <Card.Header
                className=""
                settingsBtn={setModal}
                paths={props?.paths ?? []}
            >
                {label}
            </Card.Header>
            <Card.Body className="p-0">
                <List
                    {...listData}
                    queryParameters={[]}
                    hiddenContinerWrapper
                    ajax
                />
            </Card.Body>
        </Card>
    )
}

export default NumberWidget
