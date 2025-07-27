import styles from './About.module.scss';
const About = () => {
  return (
    <div className={styles.about}>
      <div>Autor: Evgeny A</div>
      <div>
        <a href="https://github.com/EvgenOzr" className={styles.git}>
          GitHub
        </a>
      </div>
      <a href="https://app.rs.school/" className={styles.school}></a>
    </div>
  );
};

export default About;
