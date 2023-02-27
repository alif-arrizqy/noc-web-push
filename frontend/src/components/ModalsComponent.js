import { Modal } from 'antd';

const Modals = ({ show, onClose, ...props }) => {

    return (
        <>
            <Modal title="Push Data ?" open={show} onOk={props.onOk} onCancel={onClose}>
                {/* <p>Push Data ?</p> */}
            </Modal>
        </>
    );
};
export default Modals;