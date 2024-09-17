import React from 'react';
import styles from './HomePage.module.css';  

function HomePage() {
  return (
    <div className={styles.logo}>
       <div className={styles.homeLogo}> 
                <img />
            </div> 
            <div className={styles.line}></div>
        <div className={styles.homeContainer} >
            <div className={styles.homeSearch}>
                <div className={styles.homeSearchCategories}>

                </div>
            </div>
        </div>
    </div>
  );
}

export default HomePage;
