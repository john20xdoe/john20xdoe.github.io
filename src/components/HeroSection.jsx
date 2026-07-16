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
            <SlAvatar
              image="https://avatars.githubusercontent.com/u/14521605?s=120&v=4"
              label="Lee Alexis Bermejo"
            />
            <span><b> Lee Alexis Bermejo</b>.</span>
          </p>
        </div>
      </div>
    </>
  );
}
