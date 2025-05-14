import PropTypes from 'prop-types';

export default function Component({
  className = "",
  container1 = "",
  container2 = "",
  text = "Streamline Your Tasks with Minimalist Design",
  text1 = "Experience a task manager that combines a clean interface with a responsive layout, making it easy to manage your tasks on any device. Our platform offers intuitive features that enhance productivity while keeping your workflow organized.",
  container3 = "",
  container4 = "",
  text2 = "Get Started",
  container5 = "",
}) {
  return (
    <div
      className={`flex flex-col items-start gap-6 ${container1} ${className}`}
    >
      <div
        className={`flex items-center font-bold leading-[1.2] ${container2}`}
      >
        <p>{text}</p>
      </div>
      <div className="flex items-center text-lg leading-normal">
        <p>{text1}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3.5 pt-[7px] text-center leading-normal min-[1350px]:flex-nowrap">
        <button
          className={`flex items-center justify-center border border-solid px-6 py-3 text-black ${container3}`}
        >
          <div className={`text-center ${container4}`}>{text2}</div>
        </button>
        <button
          className={`flex items-center justify-center border border-solid px-6 py-3 ${container5}`}
        >
          <div className="text-center">Learn More</div>
        </button>
      </div>
    </div>
  );
}

Component.propTypes = {
  className: PropTypes.string,
  container1: PropTypes.string,
  container2: PropTypes.string,
  text: PropTypes.string,
  text1: PropTypes.string,
  container3: PropTypes.string,
  container4: PropTypes.string,
  text2: PropTypes.string,
  container5: PropTypes.string,
};

Component.defaultProps = {
  className: "",
  container1: "",
  container2: "",
  text: "Streamline Your Tasks with Minimalist Design",
  text1: "Experience a task manager that combines a clean interface with a responsive layout, making it easy to manage your tasks on any device. Our platform offers intuitive features that enhance productivity while keeping your workflow organized.",
  container3: "",
  container4: "",
  text2: "Get Started",
  container5: "",
};