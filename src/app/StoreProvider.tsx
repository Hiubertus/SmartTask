'use client'
import React, {ReactNode, useEffect, useRef} from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/lib/store'
import {setupListeners} from "@reduxjs/toolkit/query";

interface Props {
    readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
    const storeRef = useRef<AppStore>()
    if (!storeRef.current) {
        storeRef.current = makeStore()
    }
    useEffect(() => {
        if (storeRef.current != null) {
            return setupListeners(storeRef.current.dispatch);
        }
    }, []);
    return <Provider store={storeRef.current}>{children}</Provider>
}