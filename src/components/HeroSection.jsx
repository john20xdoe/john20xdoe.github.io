import SlAnimation from "@shoelace-style/shoelace/dist/react/animation/index.js";
import SlAvatar from "@shoelace-style/shoelace/dist/react/avatar/index.js";

export function HeroSection() {
  return (
    <>
      {/* Greeting */}
      <div className="row">
        <div className="col"><h1>Hi.</h1></div>
      </div>

      {/* Name + avatar */}
      <div className="row">
        <div className="col">
          <p className="name-tag">
            <span>My name is </span>

            <SlAnimation name="bounce" duration={2000} easing="ease-in-out" play>
              <SlAvatar
                image="https://avatars.githubusercontent.com/u/14521605?s=120&v=4"
                label="Lee Alexis Bermejo"
              />
            </SlAnimation>

            <span><b> Lee Alexis Bermejo</b>.</span>
          </p>
        </div>
      </div>
    </>
  );
}
