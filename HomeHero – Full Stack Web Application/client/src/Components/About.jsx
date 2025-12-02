import React from "react"; // Ensure this line is present if necessary


const About = () => {
  return (
    <div>
      <p className="h1">
        My name is Fatima Al-Amri, I am the developer of this web app that
        provides all the various home services that a person needs through one
        platform. I am very happy that you are one of the users of this
        application. I wish you a wonderful day.<br></br> Best regards.
      </p>

      <h1 className="h1">
        &copy; {new Date().getFullYear()} HOMEHERO, Salalah, Dhofar, Oman.All
        rights reserved
      </h1>
    </div>
  );
};

export default About;
