'use client'

import styles from './salespayment.module.css';
import Menu_White from "../../components/Menu_White/menu_white";
import Sides from "../../components/Sides/sides";
import Header_White from "../../components/Header_White/Header_White";
import Footer from "../../components/Footer/Footer_White";
import Services_1 from "../../components/services_1/services_1";


const Salespayment = ({}) => {
 
   return (

    <>
      <Menu_White/>
      <Header_White/>
      <Sides/>

      <Services_1/>


    

      <section id={styles.SHADOW_SECTION_BLOG} class={styles.center_holder}>
        <div class={styles.grid_0_scroll}>
            <div  id={styles.DIVIDER}>

                <div id={styles.CHECKOUT_BACKGROUND} style={{
                                        position: "relative",
                                        width: "100%",
                                        height: "1200px",
                                        backgroundColor:"white",
                                        gridArea:"CHECKOUT"}}>
                                        <div id={styles.CHECKOUT_HOLDER}>

                                        </div>
                </div>


                <div id={styles.BASKET_HOLDER} style={{
                                        position: "relative",
                                        width: "100%",
                                        height: "1200px",
                                        backgroundColor:"transparent",
                                        gridArea:"IMAGE"}}>
                </div>

            </div>
        </div>
      </section>



    
    
    <Footer/>


    </>

 );
};

export default Salespayment;



                    

                    













