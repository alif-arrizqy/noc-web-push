import { Modal } from 'antd';

const Modals = ({ titleModal, show, onClose, ...props }) => {
    return (
        <>
            <Modal title={titleModal} open={show} onOk={props.onOk} onCancel={onClose}>
                {/* <p>Push Data ?</p> */}
            </Modal>
        </>
    );
};

const DeleteModals = ({ titleModal, show, onClose, ...props }) => {
    return (
        <>
            <Modal title={titleModal} open={show} onOk={props.onOk} onCancel={onClose}>
                {/* <p>Push Data ?</p> */}
            </Modal>
        </>
    );
};

export {Modals, DeleteModals}