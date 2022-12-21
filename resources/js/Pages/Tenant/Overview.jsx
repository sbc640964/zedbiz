import ThemeDefault from "@/Layouts/Tenant/ThemeDefault";
import ContainerPage from "@/Components/Table/ContainerPage";
import RenderWidget from "@/Components/Widgets/RenderWidget";

function Overview({page, ...props}) {
    return (
        <ContainerPage
            label={<div className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold leading-none">{page.name}</h1>
                    <p className="text-gray-500 text-base font-normal">{page.description}</p>
                </div>
            </div>}
            className="bg-transparent border-0 shadow-none"
        >
            <div>
                <div>
                    {/*<DatesPickerRangeWidgets*/}
                    {/*    // onChange={newDates => setStore('rangeDate', newDates)}*/}
                    {/*    // value={store?.rangeDate ?? {}}*/}
                    {/*/>*/}
                </div>
                <div className="flex flex-wrap -mx-3">
                    {Object.keys(props).filter(i => i.startsWith('widget_')).map(widgetName => (
                        <RenderWidget
                            key={widgetName}
                            widget={props[widgetName] ?? false}
                            setModalContent={false}
                        />
                    ))}
                </div>
            </div>
        </ContainerPage>
    )
}
Overview.layout = (page) => <ThemeDefault title={page.props.title} children={page}/>;

export default Overview
