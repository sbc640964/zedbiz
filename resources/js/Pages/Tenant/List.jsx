import ThemeDefault from "@/Layouts/Tenant/ThemeDefault";
import ListComponent from "@/Pages/Admin/Apps/List";

function List(props) {
    return (
        <ListComponent {...props}/>
    );
}

List.layout = (page) => <ThemeDefault title={page.props.title} children={page}/>;

export default List;
