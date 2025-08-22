import { useForm, type SubmitHandler } from "react-hook-form";
import styles from "./Modal.module.css";
import type { AuthUser } from "../../types/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { genderOptions } from "../../types/constants";
import type { RootState } from "../../store/store";
import { setSelectedCountry } from "../../store/countrySlice";
import { useDispatch, useSelector } from "react-redux";

interface ModalProps {
  closeModal: () => void;
}

const Modal = ({ closeModal }: ModalProps) => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthUser>({ mode: "all" });

  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  const countries = useSelector(
    (state: RootState) => state.countryReducer.list
  );
  const selectedCountry = useSelector(
    (state: RootState) => state.countryReducer.selectedCountry
  );
  const selectedGender = watch("gender");
  const formSubmit: SubmitHandler<AuthUser> = (data) => {
    console.log(data);
  };

  const filteredCountries = useMemo(() => {
    if (!inputValue) return countries;
    return countries.filter((country) =>
      country.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, countries]);

  const handleSelect = (country) => {
    setInputValue(country);
    dispatch(setSelectedCountry(country));
    setIsOpen(false);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    setIsOpen(true);
    if (selectedCountry) {
      dispatch(setSelectedCountry(null));
    }
  };
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    },
    [closeModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [handleEscape]);

  return (
    <div className={styles.modal_show} onClick={closeModal}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        <span className={styles.close_button} onClick={closeModal}>
          &times;
        </span>
        <div className={styles["register-form-container"]}>
          <h2 className={styles["register-form-title"]}>Test</h2>
          <form
            className={styles["form-submit"]}
            onSubmit={handleSubmit(formSubmit)}
          >
            <div className={styles["form-item_container"]}>
              <label className={styles["form-item_title"]}>Name</label>
              <input
                className={styles["form-item_element"]}
                type="text"
                placeholder="John"
                {...register("name", {
                  required: "Name is required",
                })}
              />
            </div>
            <div className={styles["form-item_container"]}>
              <label className={styles["form-item_title"]}>Age</label>
              <input
                className={styles["form-item_element"]}
                type="number"
                placeholder="18"
                {...register("age", { min: 18, max: 99 })}
              />
            </div>
            <div className={styles["form-item_container"]}>
              <label className={styles["form-item_title"]}>Email</label>
              <input
                className={styles["form-item_element"]}
                type="email"
                placeholder="example@gmail.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>
            <div className={styles["form-item_container"]}>
              <label className={styles["form-item_title"]}>Password</label>
              <input
                className={styles["form-item_element"]}
                type="password"
                placeholder="******"
                {...register("password", {
                  required: "Email is required",
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                    message:
                      "Must contain 1 uppercase, 1 lowercase and 1 number",
                  },
                })}
              />
            </div>
            <div className={styles["form-item_container"]}>
              <label className={styles["form-item_title"]}>
                Confirm Password
              </label>
              <input
                className={styles["form-item_element"]}
                type="password"
                placeholder="******"
                {...register("password", {
                  required: "Email is required",
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                    message:
                      "Must contain 1 uppercase, 1 lowercase and 1 number",
                  },
                })}
              />
            </div>
            <div className={styles["form-item_container"]}>
              <label className={styles["form-item_title"]}>Gender</label>
              <select {...register("gender")}>
                <option value="male">male</option>
                <option value="female">female</option>
              </select>
            </div>
            <div className={styles["form-item_container"]}>
              <label className={styles["form-item_title"]}>
                Terms and Conditions agreement
              </label>
              <input type="checkbox" />
            </div>
            <div className={styles["form-item_container"]}>
              <label className={styles["form-item_title"]}>Image</label>
              <input className={styles["form-item_element"]} type="file" />
            </div>
            <div className={styles["form-item_container"]}>
              <label className={styles["form-item_title"]}>Country</label>
              <input
                className={styles["form-item_element"]}
                type="text"
                placeholder="USA"
                {...register("country", {
                  required: "Country is required",
                })}
              />
            </div>
            <button type="submit" className="login-button">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
