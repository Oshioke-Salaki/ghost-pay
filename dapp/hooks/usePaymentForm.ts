import { useState } from "react";

export function usePaymentForm() {
  const [recipientAddr, setRecipientAddr] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const isValid = recipientAddr.startsWith("0x") && Number(amount) > 0;

  const reset = () => {
    setRecipientAddr("");
    setRecipientName("");
    setDescription("");
    setAmount("");
  };

  return {
    recipientAddr,
    recipientName,
    description,
    amount,
    setRecipientAddr,
    setRecipientName,
    setDescription,
    setAmount,
    isValid,
    reset,
  };
}
