import { ChatState } from '@/types/state';
import Image from 'next/image';
import React from 'react'


interface ChatBoxProps {
    loading: boolean;
    messages: ChatState[]
}

function ChatBox({ loading, messages }: ChatBoxProps) {
    
    return (
        <div className="  rounded-lg min-h-screen p-6 max-w-3xl mt-6 w-full">
            <h2 className="text-xl text-white font-bold mb-4 text-center">Chatting</h2>
            <div className=" p-3 rounded-md h-full  overflow-y-auto flex flex-col ">
                {messages.map((msg, index) => (
                    <React.Fragment key={index}>
                        {msg.role === "bot" && (
                            <div className='flex gap-2 items-center'>
                                <Image src={'/doge.png'} alt='bot' width={40} height={40} />
                                <p className='font-light text-gray-500'>Trainer Bot</p>
                            </div>
                        )}
                        <p
                            className={`p-2 my-1 rounded-md w-fit ${msg.role === "user" ? "bg-gray-600 text-right self-end" : " text-left self-start"}`}
                        >
                            {msg.content}
                        </p>
                    </React.Fragment>
                ))}

                {loading && (
                    <div className="p-2 my-1 bg-gray-300 text-left rounded-md w-24 flex items-center justify-center">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></div>
                            <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-400"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatBox
