import Dropdown from "@/Components/Dropdown";
import Button from "@/Components/Button";
import Icon from "@/Components/Icon";

function DropdownCollectionActions({enableExport = true, enableImport = true, setOpenImportModal}) {
    return (
        <Dropdown>
            <Dropdown.Trigger>
                <Button icon="ellipsis-vertical" negative ></Button>
            </Dropdown.Trigger>
            <Dropdown.Content>
                <Dropdown.Item onClick={() => setOpenImportModal(true)} hidden={!enableImport}>
                    <div className="flex space-x-2 rtl:space-x-reverse items-center cursor-pointer w-full px-4 py-2 leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out">
                        <span><Icon name="arrow-up-tray" className="w-4 h-4"/></span>
                        <span>Import</span>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item hidden={!enableExport}>
                    <div className="flex space-x-2 rtl:space-x-reverse items-center cursor-pointer w-full px-4 py-2 leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out">
                        <span><Icon name="arrow-down-tray" className="w-4 h-4"/></span>
                        <span>Export</span>
                    </div>
                </Dropdown.Item>
            </Dropdown.Content>
        </Dropdown>
    )
}

export default DropdownCollectionActions
