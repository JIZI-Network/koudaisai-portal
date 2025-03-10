"use client";
import styles from "./page.module.css";
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from "swr";
import TextQuestion from "@/components/Forms/Questions/TextQuestion/TextQuestion";

export default function Page() {
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const access_token = localStorage.getItem('exhibitor_access_token');
    if (access_token) {
      setAuthenticated(true);
    } else {
      router.push('/login'); // トークンがない場合、ログインページにリダイレクト
    }
  }, []);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR('${API_BASE_URL}/api/v1/forms', fetcher);

  if (error) return <p>データの取得に失敗しました</p>;
  if (!data) return <p>読み込み中...</p>;

  // form_id に一致するフォームを検索
  // const form = data.find((f: any) => f.formId === formId);
  const form = data[0];
  const items = form.items;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:4010//api/v1/forms/[formId]/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${access_token}`, },
      body: JSON.stringify({ info: { title, description }, items: [], access_control: { roles: [] } }),
    });

    if (response.ok) {
      alert("フォームを作成しました！");
    } else {
      alert("エラーが発生しました。");
    }
  };

    return (
        <main className={styles.main}>
            <div className={styles.formTitleWrapper}>
                <h1>{form.info.title}</h1>
                <p>{form.info.description}</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div> 
                  {items.map((item) => {
                    if (item.item_question != null){
                      return <TextQuestion key={item.item_question.question.question_id} title={item.title} description={item.description} />;
                    }
                  })}
              </div>
              <button type="submit" >送信</button>
            </form>
            
        </main>
    );
  }