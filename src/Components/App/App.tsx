import { useState } from "react";
import { useAppSelector } from "../../store/storeHook";
import styles from "./App.module.css";
import Modal from "../Modal/Modal";

function App() {
  const {} = useAppSelector((state) => state.userReducer.users);

  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.app}>
        <button className={styles.btn_form} onClick={() => setShowModal(true)}>
          Modal 1
        </button>
        <button className={styles.btn_form}>Modal 2</button>
        {showModal && <Modal closeModal={closeModal} />}
      </div>
    </div>
  );
}

export default App;
