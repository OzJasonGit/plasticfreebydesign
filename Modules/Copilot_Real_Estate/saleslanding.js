'use client'

import styles from './saleslanding.module.css';

import { useRouter } from "next/navigation";

import Menu_White from "../../components/Menu_White/menu_white";
import Sides from "../../components/Sides/sides_white";
import Header_White from "../../components/Header_White/Header_White";

import Subfooter_White from "../../components/Subfooter_White/subfooter_white";
import Footer from "../../components/Footer/Footer_White";

import Collapsed_Sales from "../../components/Collapse_Sales/collapse_sales";

import Services_1 from "../../components/services_1/services_1";

import Link from "next/link";
import Image from "next/image";


import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import bimcopilot from './Bim-copilot-logo_Horizontal.png';


const Saleslanding = ({ stories, firstStory }) => {
  const storiesSolo_1 = stories.filter((story, i) => i == 3)
  const storiesToMap = stories.filter((story, i) => i != 0);
  const router = useRouter();

   return (

    <>
      <Menu_White/>
      <Header_White/>
      <Sides/>

      <Services_1/>


      <section id={styles.SHADOW_SECTION_BLOG} class={styles.center_holder}>
        <div class={styles.grid_0_scroll}>
            <div id={styles.SALES_GRID_HOLDER}>

                <div id={styles.PRODUCT_ID_HOLDER}
                    style={{
                        
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        }}>
                        <h1 id={styles._H1} class=" text-stone-700 ... font-avant_garde_bold">
                           <a class="text-md ... text-stone-700 ... font-geist_regular"
                              style={{marginBottom:"0px"}}>Product_ID</a> B1001
                        </h1>
                </div>

                <div  id={styles.SALES_IMAGE_HOLDER}>
                    
                        <div class="rounded-xl ..." id={styles.SALES_IMAGE}>
                            {storiesSolo_1.map((story, index) => {
                                  return (          
                                <Image
                                alt="Picture of the author"
                                key={story._id}
                                width={500}
                                height={500}
                                src={story.image}
                                style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                }}/>                        
                            )})} 
                        </div>   

                        <div id={styles.SALES_IMAGE_2}>
                            <div id={styles.SALES_IMAGE_3}>

                                 <div class="rounded-lg ..." id={styles.SALES_IMAGE_V}>
                                    {storiesSolo_1.map((story, index) => {
                                        return (                                 
                                        <Image
                                        alt="Picture of the author"
                                        key={story._id}
                                        width={500}
                                        height={500}
                                        src={story.image}
                                        style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        }}/>                    
                                    )})} 
                                </div>  

                                 <div class="rounded-lg ..." id={styles.SALES_IMAGE_W}>
                                    {storiesSolo_1.map((story, index) => {
                                        return (                 
                                        <Image
                                        alt="Picture of the author"
                                        key={story._id}
                                        width={500}
                                        height={500}
                                        src={story.image}
                                        style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        }}/>                               
                                    )})} 
                                </div>  

                                <div class="rounded-lg ..." id={styles.SALES_IMAGE_X}>
                                    {storiesSolo_1.map((story, index) => {
                                        return (
                           
                                        <Image
                                        alt="Picture of the author"
                                        key={story._id}
                                        width={500}
                                        height={500}
                                        src={story.image}
                                        style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        }}/>                    
                                    )})} 
                                </div>  

                                <div class="rounded-lg ..." id={styles.SALES_IMAGE_Y}>
                                    {storiesSolo_1.map((story, index) => {
                                        return (                      
                                        <Image
                                        alt="Picture of the author"
                                        key={story._id}
                                        width={500}
                                        height={500}
                                        src={story.image}
                                        style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        }}/>                               
                                    )})} 
                                </div> 

                                <div class="rounded-lg ..." id={styles.SALES_IMAGE_Z}>
                                    {storiesSolo_1.map((story, index) => {
                                        return (                          
                                        <Image
                                        alt="Picture of the author"
                                        key={story._id}
                                        width={500}
                                        height={500}
                                        src={story.image}
                                        style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        }}/>                           
                                    )})} 
                                </div> 
                            </div>
                        </div>                     
                                     
                </div>

                <div id={styles.SALES_CHECKOUT_HOLDER}>
                    <div  style={{
                                    position: "relative",           
                                    gridArea: "C1",
                                }}>
                        <h2 id={styles._H2}
                            class=" text-stone-700 ... font-avant_garde_bold"
                            style={{marginBottom:"0px"}}>
                            This is a test title
                        </h2>
                    </div>

                    <div  id={styles.SLUG}
                          style={{
                                    position: "relative",           
                                    gridArea: "SLUG",
                                }}>
                        <h3 class=" text-md ... text-stone-700 ... font-geist_regular"
                            style={{marginBottom:"0px"}}>              
                            This is a test title slug also used for SEO 
                        </h3>
                    </div>

                    <div  
                          style={{
                                    position: "relative",           
                                    gridArea: "C2",
                                }}>
                        <h3 class="text-md ... text-stone-700 ... font-geist_semibold"
                            style={{marginBottom:"0px"}}>
                            $12.99 <a class="text-md ... text-stone-700 ... font-geist_regular ..."> Tax included.</a>
                        </h3>                                     
                    </div>

                    <div  id={styles.C3}>
                        <h3                           
                            class="text-md ... text-stone-700 ... font-geist_semibold"
                            style={{marginBottom:"0px"}}>
                            License Type.
                        </h3>
                        <br/>

                        <Tabs defaultValue="account" className="w-[400px]">
                            <TabsList>
                                <TabsTrigger value="educatiional">Educational</TabsTrigger>
                                <TabsTrigger value="commercial">Commercial</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <br/>                      
                        <h3  class="text-md ... text-stone-700 ...font-geist_regular"
                             style={{marginBottom:"0px"}}>
                            Are you a student? Select Educational Use.
                        </h3>
                    </div>

                    <div  id={styles.C4}>
                       <div  id={styles.CHECKOUT_GRID}>

                            <div id={styles.ADD_TO_CART}>  
                                <Link href="/payment">        
                                    <Button style={{
                                            position: "absolute",
                                            width: "100%",
                                            height: "100%",}}> Add To Cart 
                                    </Button>  
                                </Link>                 
                            </div>

                            

                            <div id={styles.PAYPAL}>  
                                <Link href="/payment">
                                    <Button variant="secondary" class="border border-solid ... rounded-md ... border-stone-800 ..." style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "60px",}}>Buy with Stripe 
                                    </Button>     
                                </Link>                                                           
                            </div>

                            <div id={styles.MORE_OPTIONS}>    
                                <a>
                                </a>                           
                            </div>
                        </div>
                    </div>


                    <div  id={styles.C5}>
                        <h3 class="text-md ... text-stone-700 ... font-geist_regular"
                            style={{marginBottom:"0px"}}>
                           For Educational Use (Reduced price) please send us an email with your 
                           student card and info to <a>info@bimcopilot.com</a>
                        </h3>
                    </div>


                    <div  id={styles.C6}>
                        <h3 class="text-md ... text-stone-700 ... font-geist_regular">
                           <a></a> Digital Download
                        </h3>

                        <h3 class="text-md ... text-stone-700 ... font-geist_regular">
                           <a></a> Revit Version 2020
                        </h3>

                        <h3 class="text-md ... text-stone-700 ... font-geist_regular">
                           <a></a> Created By: Bimcopilot.com
                        </h3>

                        <h3 class="text-md ... text-stone-700 ... font-geist_regular">
                           <a></a> Pack Category: <a></a>
                        </h3>
                    </div>


                    <div  id={styles.C7}> 
                        <Collapsed_Sales/>
                    </div>
                    
                </div>

            </div>
        </div>
      </section>



      <section id={styles.SHADOW_SECTION_BLOG} class={styles.center_holder}>
        <div class={styles.grid_0_scroll}>
            <div id={styles.BOUGHT_TOGETHER_GRID}> 

                <div id={styles.BOUGHT_TOGETHER_BLOCK}>
                    <div id={styles.BOUGHT_TITLE_HOLDER}>
                        <h2 id={styles._H2} class="text-4xl ... text-stone-700 ... font-avant_garde_bold">
                            Frequently Bought Together
                        </h2>
                    </div>

                    <div id={styles.BOUGHT_IMAGE_HOLDER}>

                    <div class="rounded-lg ..." id={styles.SALES_IMAGE_A}>
                            {storiesSolo_1.map((story, index) => {
                                  return (                      
                                <Image
                                alt="Picture of the author"
                                key={story._id}
                                width={500}
                                height={500}
                                src={story.image}
                                style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                }}/>                         
                            )})} 
                        </div>  


                    <div class="rounded-lg ..." id={styles.SALES_IMAGE_B}>
                            {storiesSolo_1.map((story, index) => {
                                  return (                 
                                <Image
                                alt="Picture of the author"
                                key={story._id}
                                width={500}
                                height={500}
                                src={story.image}
                                style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                }}/>                 
                            )})} 
                        </div>  

                    <div class="rounded-lg ..." id={styles.SALES_IMAGE_C}>
                            {storiesSolo_1.map((story, index) => {
                                  return (                
                                <Image
                                alt="Picture of the author"
                                key={story._id}
                                width={500}
                                height={500}
                                src={story.image}
                                style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                }}/>              
                            )})} 
                        </div>  

                    </div>  
                </div>


                <div id={styles.BOUGHT_IMAGE_HOLDER_MOBILE}>
                    <div id={styles.BOUGHT_TOGETHER_GRID_MOBILE}> 

                        <div id={styles.BOUGHT_IMAGE_MOBILE}>

                            <div class="rounded-lg ..." id={styles.SALES_IMAGE_A}>
                                {storiesSolo_1.map((story, index) => {
                                    return (                      
                                    <Image
                                    alt="Picture of the author"
                                    key={story._id}
                                    width={500}
                                    height={500}
                                    src={story.image}
                                    style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    }}/>                         
                                )})} 
                            </div>  


                            <div class="rounded-lg ..." id={styles.SALES_IMAGE_B}>
                                {storiesSolo_1.map((story, index) => {
                                    return (                 
                                    <Image
                                    alt="Picture of the author"
                                    key={story._id}
                                    width={500}
                                    height={500}
                                    src={story.image}
                                    style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    }}/>                 
                                )})} 
                                </div>  

                            <div class="rounded-lg ..." id={styles.SALES_IMAGE_C}>
                                {storiesSolo_1.map((story, index) => {
                                    return (                
                                    <Image
                                    alt="Picture of the author"
                                    key={story._id}
                                    width={500}
                                    height={500}
                                    src={story.image}
                                    style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    }}/>              
                                )})} 
                                </div>  

                    </div> 

                    </div>                                     
                </div>

                <div id={styles.PRODUCT_DESCRIPTION}>
                    <div id={styles.P_TITLE}>
                        <h2 id={styles._H2} class="text-4xl ... text-stone-700 ... font-avant_garde_bold">
                            This is the description title 
                        </h2>
                    </div>

                    <div  id={styles.P_SUBTITLE}>   
                        <h3 id={styles._H3} class=" text-stone-700 ... font-avant_garde_bold">
                            This is the description title 
                            Delta compression using up to 12 threads
                            Compressing objects: 100% (5/5), done.     

                            <a class="text-stone-700 ... font-avant_garde_bold"
                            >
                            Automated systems for Architects, Designers and Manufacturers.
                            </a>{" "}
                            Gain valuable insights, streamline your business, be more{" "} 
                            <a class="text-stone-700 ... font-avant_garde_bold"
                            >
                            profitable 
                            </a>, be more{" "}
                            <a class="text-stone-700 ... font-avant_garde_bold"
                            >
                            sustainable
                            </a>                      
                        </h3>
                    </div>

                    <div  id={styles.P_DESCRIPTION}>  
                         <p id={styles._H3} class="text-base ... text-stone-700 ... font-geist_regular">
                            Delta compression using up to 12 threads
                            Compressing objects: 100% (5/5), done.
                            Writing objects: 100% (5/5), 440 bytes | 440.00 KiB/s, done.
                            Total 5 (delta 4), reused 0 (delta 0), pack-reused 0
                            remote: Resolving deltas: 100% (4/4), completed with 4 local objects.
                            Compressing objects: 100% (5/5), done.
                            Writing objects: 100% (5/5), 440 bytes | 440.00 KiB/s, done.
                            Total 5 (delta 4), reused 0 (delta 0), pack-reused 0
                            remote: Resolving deltas: 100% (4/4), completed with 4 local objects.
                        </p>                       
                    </div>

                </div>

            </div>
        </div>
      </section>

      <Subfooter_White/>
      <Footer/>


    </>

 );
};

export default Saleslanding;



                    

                    













