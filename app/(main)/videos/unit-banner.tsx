type UnitProps = {
    title: string;
    description: string
}

import { Button } from '@/components/ui/button';
import { NotepadText } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const UnitBanner = ({ title, description }: UnitProps) => {
    return (
        <div className='flex items-center justify-between w-full bg-green-500 rounded-xl text-white p-5'>
            <div className="space-y-2 5">
                <h3 className='text-2xl font-bold'>{title}</h3>
                <p className='text-lg'>{description}</p>
            </div>
        </div>
    )
}

export default UnitBanner