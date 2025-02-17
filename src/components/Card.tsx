import Button from "./Button";

interface CardProps {
  title: string;
  description: string;
  buttonPath: string;
  imagePosition: "left" | "right";
  imageUrl: string;
  buttonTitle: string;
}

const Card = ({
  imageUrl,
  title,
  description,
  buttonPath,
  buttonTitle,
  imagePosition = "left",
}: CardProps) => {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 md:gap-8 gap-2 w-[90%] h-full lg:items-center items-start">
      <div
        className={`w-full md:h-[80%] h-[200px] bg-cover bg-center lg:rounded-[40px] rounded-3xl ${
          imagePosition === "right" ? "md:order-2 order-1" : "order-1"
        }`}
        style={{ backgroundImage: `url('${imageUrl}')` }}
      ></div>
      <div
        className={`w-full flex flex-col items-start ${
          imagePosition === "right" ? "order-1" : "order-2"
        }`}
      >
        <h2 className="font-main font-bold text-[clamp(2rem,1.6429rem+1.7857vw,4.5rem)] leading-[1] text-[#CC5500]">
          {title}
        </h2>
        <p className="font-tertiary font-medium text-[clamp(1.125rem,1.0357rem+0.4464vw,1.75rem)] leading-[1] mt-3 mb-5 text-[#000]">
          {description}
        </p>
      <Button buttonPath={buttonPath} buttonTitle={buttonTitle}/>
      </div>
    </div>
  );
};

export default Card;

