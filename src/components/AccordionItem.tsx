import React, { useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import Text from './headers/Text';

interface AccordionItemProps {
  title: string;
  description: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  description,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="mb-7 ">
      <div className="flex justify-between items-center cursor-pointer border-b-[1px] pb-4 border-black" onClick={toggleAccordion}>
        <Text variant="Body" className="lg:!font-bold lg:!text-[20px]">{title}</Text>
        <TiArrowSortedDown className={`md:size-[32px] size-[24px] md:min-w-[32px] min-w-[24px] transform transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out`} style={{maxHeight: isOpen ? "600px" : "0",}}>
        <div className="py-2 text-black font-medium">{description}</div>
      </div>
    </div>
  );
};

export default AccordionItem;
