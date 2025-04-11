'use client';

import React, { useState } from 'react'
import Image from 'next/image'

import styles from './PostCard.module.css';

import { IoCart } from "react-icons/io5";

const BookCard = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    
    return (
        <div className='col-12 col-md-6 col-lg-4 mt-4 mb-5 px-3'>
            <picture className={`rounded-image ${styles.imageWrapper}`}>
                <Image
                    className="rounded-image"
                    src={'/ui/placeholder.png'}
                    alt={''}
                    title={''}
                    sizes="(max-width: 576px) 100vw,   
                            (max-width: 768px) 80vw,   
                            (max-width: 992px) 70vw,   
                            (max-width: 1200px) 60vw,  
                            (max-width: 1400px) 50vw,  
                            730px"
                    width={354}
                    height={354}
                    loading="lazy"
                />
            </picture>

            <h2 className={`${styles.heading} subheading py-1 mt-3`} id="col-heading-1">
                Another book title
            </h2>

            <p className={`${styles.description}`}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit eos vel id vero, temporibus deserunt dicta odio, maxime odit facilis consequatur in tempora asperiores minima!</p>
            
            <div className="relative inline-block text-left">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="btn-purchase"
                >
                    <IoCart className='btn-filled-svg' /> Purchase ▼
                </button>

                {isOpen && (
                    <div className="fixed left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                        <ul className="py-2">
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                                    Option 1
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                                    Option 2
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-200">
                                    Option 3
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BookCard