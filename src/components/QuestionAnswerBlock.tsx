import React from 'react';
import AccordionItem from "./AccordionItem";

export interface DataItem {
    title: string;
    description: React.ReactNode;
}

interface QuestionAnswerBlockProps {
    data: DataItem[]
    isOnlyTopPadding?: boolean;
}

const QuestionAnswerBlock: React.FC<QuestionAnswerBlockProps> = ({data, isOnlyTopPadding = true}) => {
    return (
        <div className={`bg-white text-black flex flex-col lg:flex-row justify-between ${isOnlyTopPadding ? "pt-[48px]" : "py-[48px]"}`}>
            <h1 className="min-w-[300px] text-[24px] lg:text-[32px] font-bold lg:mb-0 mb-7">Вопрос & ответ</h1>
            <div className="lg:max-w-[780px] w-full">
                {data.map((item, index) => (
                    <AccordionItem key={index} title={item.title} description={item.description} />
                ))}
            </div>
        </div>
    );
};

export default QuestionAnswerBlock;