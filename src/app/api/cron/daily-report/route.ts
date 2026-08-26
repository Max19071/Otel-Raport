import { NextResponse } from 'next/server';
import { readStore, writeStore, type Review } from '@/lib/store';
import nodemailer from 'nodemailer';

function fetchRecentGoogleReviews(){const stamp=Date.now();return[
{externalId:`demo_1_${stamp}`,authorName:'Ahmet Yılmaz',rating:5,text:'Gölköy Yaşam Resort gerçekten harika bir yer. Hizmet mükemmel, odalar çok temiz.',time:new Date().toISOString()},
{externalId:`demo_2_${stamp}`,authorName:'Ayşe Kaya',rating:2,text:'Personel ve hizmet beklentimin altında kaldı.',time:new Date().toISOString()},
{externalId:`demo_3_${stamp}`,authorName:'Mehmet Demir',rating:3,text:'Fiyat performans olarak ortalama diyebilirim.',time:new Date().toISOString()}];}
function analyzeSentiment(rating:number):Review['sentiment']{if(rating>=4)return'olumlu';if(rating<=2)return'olumsuz';return'notre';}

export async function POST(){
 try{
  const store=await readStore(); const fetched=fetchRecentGoogleReviews(); const newReviews:Review[]=[];
  for(const item of fetched){if(!store.reviews.some(r=>r.externalId===item.externalId)){const review:Review={id:store.reviews.reduce((m,r)=>Math.max(m,r.id),0)+newReviews.length+1,...item,sentiment:analyzeSentiment(item.rating)};store.reviews.push(review);newReviews.push(review);}}
  const olumlu=newReviews.filter(r=>r.sentiment==='olumlu'), olumsuz=newReviews.filter(r=>r.sentiment==='olumsuz'), notre=newReviews.filter(r=>r.sentiment==='notre');
  let reportText='Gölköy Yaşam Resort - Günlük Yorum Raporu\n\n';
  reportText+='=== OLUMLU YORUMLAR ===\n'+(olumlu.map(r=>`- ${r.authorName} (${r.rating} Yıldız): ${r.text}`).join('\n')||'Yok')+'\n\n';
  reportText+='=== OLUMSUZ YORUMLAR ===\n'+(olumsuz.map(r=>`- ${r.authorName} (${r.rating} Yıldız): ${r.text}`).join('\n')||'Yok')+'\n\n';
  reportText+='=== NÖTR YORUMLAR ===\n'+(notre.map(r=>`- ${r.authorName} (${r.rating} Yıldız): ${r.text}`).join('\n')||'Yok');
  const webhookUrl=store.settings.webhookUrl, fallbackEmail=store.settings.fallbackEmail; let status='success',message='Rapor oluşturuldu ve yerel olarak kaydedildi.';
  if(webhookUrl){try{const res=await fetch(webhookUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:'Gölköy Yaşam Resort - Günlük Rapor',content:reportText,counts:{olumlu:olumlu.length,olumsuz:olumsuz.length,notre:notre.length}})});if(!res.ok)throw new Error(`Webhook ${res.status}`);message='Rapor webhook adresine gönderildi.';}catch(error){status='warning';message=`Webhook gönderimi başarısız: ${error instanceof Error?error.message:'bilinmeyen hata'}`;}}
  else if(fallbackEmail){try{const testAccount=await nodemailer.createTestAccount();const transporter=nodemailer.createTransport({host:'smtp.ethereal.email',port:587,secure:false,auth:{user:testAccount.user,pass:testAccount.pass}});const info=await transporter.sendMail({from:'"Gölköy Yaşam Bot" <bot@golkoyyasam.com>',to:fallbackEmail,subject:'Gölköy Yaşam Resort - Günlük Yorum Raporu',text:reportText});message=`Test e-postası gönderildi. Önizleme: ${nodemailer.getTestMessageUrl(info)}`;}catch(error){status='warning';message=`E-posta gönderimi başarısız; rapor yine de kaydedildi: ${error instanceof Error?error.message:'bilinmeyen hata'}`;}}
  store.reportLogs.push({id:store.reportLogs.length+1,status,message,createdAt:new Date().toISOString()});await writeStore(store);return NextResponse.json({success:true,newReviewsCount:newReviews.length,status,message});
 }catch(error){return NextResponse.json({success:false,error:error instanceof Error?error.message:'Bilinmeyen hata'},{status:500});}
}
