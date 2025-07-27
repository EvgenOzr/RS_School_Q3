import './Spinner.css';

const Spinner = () => {
  return (
    <div className="lds-css" data-testid="spinner">
      <div className="lds-double-ring">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Spinner;
