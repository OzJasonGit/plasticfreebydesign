'use client'

import styles from './projects.module.css';

import { useRouter } from "next/navigation";

import Menu from "../../components/Menu/menu";
import Sides from "../../components/Sides/sides";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Subscribetop from "../../components/Subscribetop/subscribetop";
import Subfooter from "../../components/Subfooter2/subfooter2";

import Image from "next/image";

const Projectsmain = ({ stories, firstStory }) => {
  const storiesToMap = stories.filter((story, i) => i != 0);
  const router = useRouter();

   return (

    <>
      <Menu/>
      <Header/>
      <Sides/>
      <Subscribetop/>

      <section id={styles.SHADOW_SECTION_BLOG} class={styles.center_holder}>
          <div class={styles.grid_0_client_showcase}>
                         
              <div id={styles.PORTFOLIO_IMAGES}>  
                <div class="" id={styles.PORTFOLIO_CLIENT}>

                  <div class="bg-neutral-200 rounded-xl ... shadow-2xl shadow-black" id={styles.P1}>                   
                  </div>

                  <div class="bg-red-200 rounded-xl ... shadow-2xl shadow-black" id={styles.P2}> 
                    <div id={styles.IMAGE_POST}>
                      <Image
                        src={stories[1].image}
                        alt="Picture of the author"
                        width={500}
                        height={500}
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                  </div>

                  <div class="" id={styles.P3}>   
                    <div id={styles.CLIENT_TAG_1}>
                        <h1                 
                          id={styles._H2_7XL}
                          class="text-left ... text-4xl ... text-stone-200 ... font-avant_garde_bold"
                        >         
                          Client <br/>
                          Showcase
                        </h1>
                        <br/>
                    </div>                 
                  </div>

                  <div class="bg-neutral-200 rounded-xl ... shadow-2xl shadow-black" id={styles.P4}>                  
                  </div>

                  <div class="bg-red-200 rounded-xl ... shadow-2xl shadow-black" id={styles.P5}>
                    <div id={styles.IMAGE_POST}>
                      <Image
                        src={stories[3].image}
                        alt="Picture of the author"
                        width={500}
                        height={500}
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>

                  <div class="bg-red-200 rounded-xl ... shadow-2xl shadow-black" id={styles.P6}>
                    <div id={styles.IMAGE_POST}>
                      <Image
                        src={stories[2].image}
                        alt="Picture of the author"
                        width={500}
                        height={500}
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>

                  <div class="bg-red-200 rounded-xl ... shadow-2xl shadow-black" id={styles.P7}>
                    <div id={styles.IMAGE_POST}>
                      <Image
                        src={stories[0].image}
                        alt="Picture of the author"
                        width={500}
                        height={500}
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>
                 
                </div>                   
              </div> 
     
          </div>
      </section>


      <section id={styles.SHADOW_SECTION_BLOG} class={styles.center_holder}>
          <div class={styles.grid_0_subscribe}>
            <div class={styles.sub_head}>
              
            </div>
          </div>
      </section>

      <Subfooter/>
      <Footer/>
      
      
    </>

    

 );
};

export default Projectsmain;