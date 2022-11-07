import Authenticated from "@/Layouts/Authenticated";
import UsersPage from "@/Pages/Admin/UsersPage";


function Index(props) {
    return (
        <UsersPage {...props} />
    );
}

Index.layout = page => <Authenticated children={page} title={'Users'} />;

export default Index
