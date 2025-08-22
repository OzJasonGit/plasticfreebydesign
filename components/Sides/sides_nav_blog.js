"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faYoutube, faInstagram, faSquareXTwitter, faGithub, faMedium, fa } from '@fortawesome/free-brands-svg-icons'

import styles from './sides_nav_blog.module.css'
import React, { Component } from 'react';
import Link from 'next/link'
import 'antd/dist/reset.css';



import Image from "next/image";
import pfbdImage from './pfbd_3.png';
import dlpfbdImage from './_dlpfbd_.svg';


export default class Sides extends Component {

    render() {
        return (


            <div class={styles.wrapper_2}>

                <div class="bg-gradient-to-t from-cyan-500  bg-transparent bg-opacity-20" id={styles.FIXED_GRADIENT}>
                </div>

                <div class={styles.fixed_center}>
                    <div class={styles.grid_0_fixed}>

                        <div id={styles.LEFT_FIXED}>
                            <div id={styles.LEFT_FIXED_STICKY}>
                                <div id={styles.ICON_SIDE_1}>
                                    <div id={styles.ICON_SIDE_2}>
                                        <div id={styles.ICON_GRID} class={styles.container}>


                                            <div id={styles.PFBD_ICON} class={styles.icon}>
                                                <Link id={styles.PFBD_LINK} href="/" target="_blank">
                                                    <div id={styles._PFBD_}>
                                                        <Image id={styles.CENTER}
                                                            loading='lazy'
                                                            src={pfbdImage}
                                                            alt=''
                                                            style={{ objectFit: "contain" }}
                                                            quality={100}
                                                        />
                                                    </div>
                                                </Link>
                                            </div>

                                            <div id={styles.DESIGN_LAB_ICON} class={styles.icon}>
                                                <Link id={styles.PFBD_LINK} href="/" target="_blank">
                                                    <div id={styles._PFBD_}>
                                                        <Image id={styles.CENTER}
                                                            loading='lazy'
                                                            alt=''
                                                            src={dlpfbdImage}
                                                            style={{ objectFit: "contain" }}
                                                            quality={100}
                                                        />
                                                    </div>
                                                </Link>
                                            </div>

                                            <div id={styles.OZ_JASON_ICON} class={styles.icon}>
                                                <Link id={styles.PFBD_LINK} href="/" target="_blank">
                                                    <div id={styles._PFBD_}>
                                                        <Image id={styles.CENTER}
                                                            src={pfbdImage}
                                                            loading='lazy'
                                                            alt=''
                                                            style={{ objectFit: "contain" }}
                                                            quality={100}
                                                        />
                                                    </div>
                                                </Link>
                                            </div>


                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>


                        <div id={styles.RIGHT_FIXED}>
                            <div id={styles.RIGHT_FIXED_STICKY}>
                                <div id={styles.PFBD_LINKS}>
                                    <div id={styles.ICON_PLACEHOLDER} class={styles.container}>
                                        <h3 class="font-avant_garde_bold ... text-stone-700 ..." id={styles.SIDE_TEXT} >Welcome     to   <a><Link class="text-emerald-400" href="/">bimcopilot.com</Link></a> </h3>
                                    </div>
                                </div>

                                <div id={styles.PAGE_NAVIGATION}>

                                    <div class="bg-stone-700  ..." id={styles.LINE_1}>
                                    </div>

                                    <div id={styles.NAV_LINK}>

                                        <Link class="" id={styles.ANCHOR_1} href="/">                                            
                                            <FontAwesomeIcon class={styles.linkedin} id={styles.CENTER} icon={faLinkedin} size="2xs" />                                       
                                        </Link>

                                        <Link class="" id={styles.ANCHOR_2} href="/">
                                            <FontAwesomeIcon class={styles.instagram} id={styles.CENTER} icon={faInstagram} size="2xs" />  
                                        </Link>

                                        <Link class="" id={styles.ANCHOR_3} href="/">
                                            <FontAwesomeIcon class={styles.youtube} id={styles.CENTER} icon={faYoutube} size="2xs" />  
                                        </Link>

                                        <Link class="" id={styles.ANCHOR_4} href="/">
                                            <FontAwesomeIcon class={styles.xtwitter} id={styles.CENTER} icon={faSquareXTwitter} size="2xs" />  
                                        </Link>
                                        
                                    </div>
                                   
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>





        )

    }


}
