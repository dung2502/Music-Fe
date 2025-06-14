import {Avatar, Button, Flex, Form, Group, Input, Label, Typography} from "lvq";
import {BsArrowReturnRight} from "react-icons/bs";
import like from "../../assets/gif/like.gif";
import love from "../../assets/gif/love.gif";
import haha from "../../assets/gif/haha.gif";
import wow from "../../assets/gif/wow.gif";
import dislike from "../../assets/gif/dislike.gif";
import { useState } from "react";
import { ModalDeleteComment } from "../Modal/ModalDeleteComment/ModalDeleteComment";

export function ReplyComponent(
    {
        comment,
        userId,
        handleOpenReplyBox,
        onSubmitReply,
        registerReply,
        handleSubmitReply,
        isReply,
        commentId,
        handleLikeComment,
        handleDislikeComment,
        handleHahaComment,
        handleWowComment,
        handleHeartComment,
        handleLoadMoreReplies,
        repliesSize,
        commentIndex,
        timeAgo,
        userHasEmotion,
        handleRemoveEmotionComment,
        openDeleteModal
    }
) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const handleOpenDeleteModal = (commentId) => {
        setCommentToDelete(commentId);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setCommentToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleConfirmDelete = () => {
        openDeleteModal(commentToDelete);
        handleCloseDeleteModal();
    };

    const userEmotion = userHasEmotion(comment);
    return (
        <>
            <Flex justifyContent={'start'} alignItems={"start"} key={comment.commentId}>
                <Typography><BsArrowReturnRight/></Typography>
                <Avatar size={30} src={comment.user.avatar}></Avatar>
                <Group gap={10} gd={{width: '80%', lineHeight: 0.6}}>
                    <Flex>
                        <Typography tag={'p'} gd={{fontSize: '0.8rem'}}>{comment.user.fullName}</Typography>
                        <Typography tag={'p'} gd={{fontSize: '0.6rem'}}>{timeAgo(comment.createdAt)}</Typography>
                    </Flex>
                    <Typography tag={'p'} gd={{fontSize: '.7rem'}}>{comment.content}</Typography>
                    <Flex justifyContent={'start'} alignItems={"center"}>
                        <Flex className={'select-emotion'} gd={{width: "35%"}}>
                            <Button theme="reset" text={
                                userEmotion === 'like' ?
                                    <Typography tag={'span'}
                                                gd={{color: '#17b6d1', fontSize: '.7rem', padding: '0 3px'}}
                                    >Đã thích</Typography>
                                    :
                                    userEmotion === 'dislike' ?
                                        <Typography tag={'span'}
                                                    gd={{color: '#ccc', fontSize: '.7rem', padding: '0 3px'}}
                                        >Không thích</Typography>
                                        :
                                        userEmotion === 'heart' ?
                                            <Typography tag={'span'}
                                                        gd={{color: '#ec255a', fontSize: '.7rem', padding: '0 3px'}}
                                            >Yêu thích</Typography>
                                            :
                                            userEmotion === 'haha' ?
                                                <Typography tag={'span'}
                                                            gd={{color: '#f6b619', fontSize: '.7rem', padding: '0 3px'}}
                                                >Haha</Typography>
                                                :
                                                userEmotion === 'wow' ?
                                                    <Typography tag={'span'}
                                                                gd={{color: '#f6b619', fontSize: '.7rem', padding: '0 3px'}}
                                                    >Wow</Typography>
                                                    :
                                                    <Typography tag={'span'}
                                                                gd={{fontSize: '.7rem', padding: '0 3px'}}
                                                                onClick={()=>handleLikeComment(comment)}
                                                    >Thích</Typography>

                            }
                                    onClick={() => handleRemoveEmotionComment(comment.commentId)}
                            />

                            <Flex className={'emotion-button'}>
                                <Button theme="reset"
                                        onClick={() => handleLikeComment(comment)}
                                        icon={<img src={like} alt="haha" height={18}/>}/>
                                <Button theme="reset" icon={<img src={love} alt="haha"
                                                                 height={18}/>}
                                        onClick={() => handleHeartComment(comment)}
                                />
                                <Button theme="reset"
                                        icon={<img src={haha} alt="haha" height={18}/>}
                                        onClick={() => handleHahaComment(comment)}
                                />
                                <Button theme="reset"
                                        icon={<img src={wow} alt="haha" height={18}/>}
                                        onClick={() => handleWowComment(comment)}
                                />
                                <Button theme="reset"
                                        onClick={() => handleDislikeComment(comment)}
                                        icon={<img src={dislike} alt="haha" height={18}/>}/>
                            </Flex>
                        </Flex>

                        <Button theme="reset" gd={{padding: '0 10px', width: '20%'}}
                                text={<Typography tag={'span'} gd={{fontSize: '.6rem'}}>Phản hồi</Typography>}
                                onClick={() => handleOpenReplyBox(comment.commentId)}/>
                        {comment.user?.userId === userId && (
                            <Button
                                theme="reset"
                                gd={{padding: '0 10px', width: '20%'}}
                                text={<Typography tag="span" gd={{fontSize: '.6rem', color: 'red'}}>Gỡ</Typography>}
                                onClick={() => handleOpenDeleteModal(comment.commentId)}
                            />
                        )}

                        <Flex justifyContent={'start'} gap={1} alignItems={"center"} gd={{width: "45%"}}>
                            {
                                comment.likes &&
                                <Flex className={"emotion-number"}>
                                    <Button theme="reset"
                                            icon={<img src={like} height={18} alt="like"/>}/>
                                    <Typography tag={'span'} className={'total-emotion'} >
                                        {comment.likes.length}</Typography>
                                </Flex>
                            }
                            {
                                comment.hearts &&
                                <Flex className={"emotion-number"}>
                                    <Button theme="reset"
                                            icon={<img src={love} height={18} alt="love"/>}/>
                                    <Typography tag={'span'} className={'total-emotion'} >
                                        {comment.hearts.length}</Typography>
                                </Flex>
                            }
                            {
                                comment.hahas &&
                                <Flex className={"emotion-number"}>
                                    <Button theme="reset"
                                            icon={<img src={haha} height={18} alt="haha"/>}/>
                                    <Typography tag={'span'} className={'total-emotion'} >
                                        {comment.hahas.length}</Typography>
                                </Flex>

                            }
                            {
                                comment.wows &&
                                <Flex className={"emotion-number"}>
                                    <Button theme="reset"
                                            icon={<img src={wow} height={18} alt="wow"/>}/>
                                    <Typography tag={'span'} className={'total-emotion'} >
                                        {comment.wows.length}</Typography>
                                </Flex>
                            }
                            {
                                comment.dislikes &&
                                <Flex className={"emotion-number"}>
                                    <Button theme="reset"
                                            icon={<img src={dislike} height={18} alt="wow"/>}/>
                                    <Typography tag={'span'} className={'total-emotion'} >
                                        {comment.dislikes.length}</Typography>
                                </Flex>

                            }
                        </Flex>
                    </Flex>

                </Group>
            </Flex>

            {comment.replies?.content && comment.replies?.content.length > 0 && (
                <div style={{marginLeft: 20}}>
                    {comment.replies?.content.map(reply => (
                        <ReplyComponent
                            key={reply.commentId}
                            comment={reply}
                            userId={userId}
                            handleOpenReplyBox={handleOpenReplyBox}
                            onSubmitReply={onSubmitReply}
                            registerReply={registerReply}
                            handleSubmitReply={handleSubmitReply}
                            isReply={isReply}
                            commentId={commentId}
                            handleLikeComment={handleLikeComment}
                            handleDislikeComment={handleDislikeComment}
                            handleHahaComment={handleHahaComment}
                            handleWowComment={handleWowComment}
                            handleHeartComment={handleHeartComment}
                            handleLoadMoreReplies={handleLoadMoreReplies}
                            repliesSize={reply.replies?.size || 0}
                            commentIndex={commentIndex}
                            timeAgo={timeAgo}
                            userHasEmotion={userHasEmotion}
                            handleRemoveEmotionComment={handleRemoveEmotionComment}
                            openDeleteModal={openDeleteModal}
                        />
                    ))}
                </div>
            )}

            {comment.replies?.numberOfElements === 5 &&
                comment.replies?.totalElements - comment.replies?.numberOfElements > 0 && (
                    <Typography tag={'span'} gd={{fontSize: '.8rem', marginLeft: 40}}
                                onClick={() => handleLoadMoreReplies(commentIndex, comment.commentId, repliesSize)}
                    >
                        Xem thêm {
                        comment.replies?.totalElements - comment.replies?.numberOfElements < 5 ?
                            comment.replies?.totalElements - comment.replies?.numberOfElements : 5
                    } phản hồi nữa...
                    </Typography>
                )}

            {isReply && comment.commentId === commentId &&
                <Form onSubmit={handleSubmitReply(onSubmitReply)} gd={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                    height: '50px',
                    background: "transparent",
                    margin: 0
                }}>
                    <Label>
                        <Input
                            placeholder={userId === 0 ? "Đăng nhập để bình luận" : "Nhập gì đó đi"}
                            disabled={userId === 0}
                            {...registerReply('replyContent', {required: "Không được để trống!"})}
                            gd={{height: '30px', border: 'none'}}/>
                    </Label>
                    <Label>
                        <Input type={'hidden'} {...registerReply('parentComment')}
                               value={JSON.stringify(comment)} gd={{height: '30px', border: 'none'}}/>
                    </Label>
                    <Button type={'submit'}
                            className={'submit-comment'}
                            gd={{
                        height: '30px',
                        fontSize: '.7rem',
                        border: 'none',
                        marginLeft: 10
                    }} text={"Đăng tải"}></Button>
                </Form>
            }

            <ModalDeleteComment 
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}