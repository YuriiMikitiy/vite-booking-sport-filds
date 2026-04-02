import InputSection from "./InputSection/InputSection"

export default function HomePage(){
    return(
        <div className="home-layout">
         <InputSection />
        <img
          className="home-side-image"
          src="/src/assets/images/1sport-children.png"
          alt="1sport-children"
        />
        </div>
    )
}