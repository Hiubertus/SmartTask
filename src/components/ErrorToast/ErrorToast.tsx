"use client"

import {useToast} from "@/hooks/use-toast";
import {useCallback} from "react";

export const useErrorToast = () => {
    const { toast } = useToast();

    return useCallback((message: string) => {
        toast({
            variant: "destructive",
            title: "Error",
            description: message,
        });
    }, [toast]);
};
