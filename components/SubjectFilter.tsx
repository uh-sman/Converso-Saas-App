"use client";
import { subjects, subjectsFilter } from "@/constants";
import { FormFieldComponent } from "./FormFieldComponent";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const SubjectFilter = () => {
  const router = useRouter()
  const searchParams = useSearchParams();
  const query = searchParams.get('subject') || ''

  const [subject, setSubject] = useState(query)
  
  useEffect(() => {
    let newUrl = ''
    if (subject === 'all') {
      newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ['subject']
      })
    }else {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "subject",
        value: subject,
      });
    }
    router.push(newUrl, { scroll: false })
  },[subject])
  return (
    <Select
      onValueChange={setSubject}
      value={subject}
    >
      <SelectTrigger className="input capitalize">
        <SelectValue placeholder="Select subject" />
      </SelectTrigger>
      <SelectContent>
        {subjectsFilter.map((option) => (
          <SelectItem key={option} value={option} className="capitalize">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
export default SubjectFilter;
