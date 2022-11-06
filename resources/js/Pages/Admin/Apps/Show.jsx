import Authenticated from "@/Layouts/Authenticated";
import App from "@/Layouts/App";

function Show({app}) {
    return (
        <div>

        </div>
    )
}
Show.layout = page => <Authenticated title={'Edit App'}>
    <App children={page}/>
</Authenticated>;

export default Show
