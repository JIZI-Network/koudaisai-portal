'use client'; // クライアントサイドコンポーネントとして実行するために追加

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {getTokens} from "@/lib/auth";

export default function Page() {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const tokens = await getTokens()
      if (tokens) {
        setAuthenticated(true);
      } else {
        router.push('/login'); // トークンがない場合、ログインページにリダイレクト
      }
    })();
  }, []);

  return (
    <div>
      {authenticated ? (
        <h1>ログイン済みです</h1>
      ) : (
        <h1>ログインしていません</h1>
      )}
    </div>
  );
}