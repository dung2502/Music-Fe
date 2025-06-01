import { Button, Flex, Typography } from "lvq";
import "./ModalDeleteComment.scss";

export function ModalDeleteComment({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <Typography tag="p" gd={{ fontSize: '1rem', marginBottom: 10 }}>
                    Bạn có chắc chắn muốn xóa bình luận này không?
                </Typography>
                <Flex justifyContent="end" gap={10}>
                    <Button text="Hủy" onClick={onClose} />
                    <Button 
                        text="Xác nhận" 
                        gd={{ backgroundColor: "red", color: "white" }} 
                        onClick={onConfirm} 
                    />
                </Flex>
            </div>
        </div>
    );
}
