import React from 'react'
import '../../contents/scss/CarDetails.scss';
import Faq from '../faq/Faq';

function CarDetails() {
  return (
    <div>
        <div className="detail-page">
            <div className="row pt-3">
                <div className="col-lg-12 d-flex justify-content-start px-0">
                <button className='btn btn-sm custom_btn detail-btn'>
             Back to Search
            </button>
                </div>
<section>
             <div className="col-lg-12 d-flex justify-content-between px-0">
    <div className="d-flex flex-column align-items-start mt-5  w-50 heading-div">
    <h2>2022 Jeep Wrangler Unlimited Sport Altitude 4x4</h2>
    <p><span>Subtitle</span></p>
    <h4>Stock: P5131995<svg width="25" height="25" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="16.0013" cy="16" r="13.6667" transform="rotate(-180 16.0013 16)" stroke="#5C666F" stroke-width="2"/>
<circle cx="16.0016" cy="10.4" r="1.6" transform="rotate(-180 16.0016 10.4)" fill="#5C666F"/>
<path d="M16 15.3345V21.3333" stroke="#5C666F" stroke-width="2" stroke-linecap="round"/>
</svg>
</h4>
    </div>

    <div className="d-flex flex-column align-items-start mt-5 price-div">
    <p><span>Price</span></p>
    <h2>$25,999</h2>
    <p><span>est. $585/mo</span></p>
    </div>
   <div className='btn-learn-more d-flex flex-column justify-content-center'>
   <button className='btn btn-sm custom_btn detail-btn'>
             Learn More
            
            </button>
   </div>

              </div>
 </section>
<section>
<div className="row vehicle-image px-0">
    <div className="col-lg-9 left-side-image">
        <div className="image-source"><img src='../../media/Vehicle-1.png'/></div>
        <div className="image-wrapper-detail d-flex">
  <div className="image-container-wrap my-2 me-2">
  <img src='../../media/Vehicle-1.png' className='first-image'/>
  </div>
  <div className="image-container-wrap my-2 me-2">
  <img src='./../media/Vehicle-2.png'/>
  </div>
  <div className="image-container-wrap my-2 me-2">
  <img src='../../media/Vehicle-3.png'/>
  </div>
  <div className="image-container-wrap my-2 me-2">
  <img src='../../media/Vehicle-1.png'/>
  </div>
  <div className="my-2 d-flex align-items-center p-3 counter-container">
  <p className='text-white'>+12</p>
  </div>
        
        </div>
    </div>
    <div className="col-lg-3 right-side-content pe-0 me-0">
        <div className="card py-4 px-5">
            <div className="d-flex pb-5">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_8176_74989)">
<path d="M27.9987 0.509033C12.8156 0.509033 0.507812 12.8173 0.507812 27.9999C0.507812 43.182 12.8156 55.491 27.9987 55.491C43.1808 55.491 55.4897 43.182 55.4897 27.9999C55.4897 12.8173 43.1808 0.509033 27.9987 0.509033Z" fill="url(#paint0_linear_8176_74989)"/>
<path d="M28.0039 2.89014C14.1343 2.89014 2.89453 14.1365 2.89453 27.999C2.89453 41.8626 14.1343 53.1095 28.0039 53.1095C41.8675 53.1095 53.1079 41.8626 53.1079 27.999C53.1074 14.1365 41.8675 2.89014 28.0039 2.89014Z" fill="url(#paint1_radial_8176_74989)"/>
<path d="M23.0347 36.9391C23.0347 36.9391 24.9973 33.0675 29.8922 35.6506C29.8922 35.6506 31.6908 36.8042 32.9422 39.5772C34.194 42.3513 36.5883 43.819 36.5883 43.819C36.5883 43.819 29.7104 46.8837 24.8608 43.8785C20.0107 40.8749 22.2512 38.1502 22.2512 38.1502C22.2512 38.1502 20.8752 37.9675 19.9502 38.8462L19.4141 38.5814C19.4141 38.5814 23.4975 34.2165 31.5243 42.1721C31.5248 42.1721 29.0099 36.8286 23.0347 36.9391Z" fill="white"/>
<path d="M44.1616 16.7323L41.3301 17.3752C40.9946 17.4516 40.7477 17.7194 40.683 18.0371L39.141 14.8675C38.5148 13.584 36.929 12.7486 35.5305 12.7145C30.2843 12.5781 25.0376 12.5725 19.7899 12.7145C18.4867 12.7481 17.2903 13.722 16.7603 14.8766L15.3155 18.0269C15.2473 17.7128 15.003 17.4491 14.671 17.3747L11.8395 16.7318C10.7184 16.4777 10.2781 18.4321 11.3955 18.6846L13.4294 19.1459C11.3054 20.4782 11.1883 23.328 11.7544 26.1158V31.2016C11.7544 31.5519 12.1307 31.835 12.5924 31.835H17.7332C18.1939 31.835 18.5707 31.5514 18.5707 31.2016V30.996H37.4304V31.2016C37.4304 31.5519 37.8072 31.835 38.2684 31.835H43.4097C43.8689 31.835 44.2467 31.5514 44.2467 31.2016V26.6326C44.8077 23.7068 44.6641 20.582 42.4857 19.1642L44.6056 18.6841C45.722 18.4326 45.2816 16.4782 44.1616 16.7323ZM18.0972 15.0935C18.4862 14.2489 19.484 13.7836 20.5856 13.7592C25.4439 13.6416 29.9259 13.6487 34.7862 13.7592C36.0294 13.7856 37.3566 14.1573 37.8133 15.0935L39.3568 18.2611C31.747 17.3096 24.2567 17.2795 16.6499 18.2478L18.0972 15.0935ZM17.2918 25.0554C15.0549 25.0554 13.2303 24.504 13.2303 23.828C13.2303 20.2119 27.8463 25.0554 17.2918 25.0554ZM34.3683 29.3094C34.3683 29.711 34.0348 30.0384 33.6286 30.0384H22.3726C21.9648 30.0384 21.6318 29.711 21.6318 29.3094V27.7154C21.6318 27.3158 21.9648 26.9843 22.3726 26.9843H33.628C34.0343 26.9843 34.3678 27.3152 34.3678 27.7154V29.3094H34.3683ZM42.7698 23.828C42.7698 24.504 40.9462 25.0554 38.7088 25.0554C28.1533 25.0554 42.7698 20.2119 42.7698 23.828Z" fill="#E9FF32"/>
</g>
<defs>
<linearGradient id="paint0_linear_8176_74989" x1="0.507812" y1="28" x2="55.4897" y2="28" gradientUnits="userSpaceOnUse">
<stop stop-color="#66686A"/>
<stop offset="0.0962" stop-color="#A3A5A7"/>
<stop offset="0.5427" stop-color="white"/>
<stop offset="0.9077" stop-color="#A3A5A7"/>
<stop offset="1" stop-color="#66686A"/>
</linearGradient>
<radialGradient id="paint1_radial_8176_74989" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(28.001 27.9999) scale(27.4909 27.4909)">
<stop stop-color="#545758"/>
<stop offset="1" stop-color="#2F2A2B"/>
</radialGradient>
<clipPath id="clip0_8176_74989">
<rect width="56" height="56" fill="white"/>
</clipPath>
</defs>
</svg>
                
                   
<div className="d-flex flex-column ms-3">
<p>Mileage</p>
<p>111,463 miles</p>
</div>
               
            </div>
            <div className="d-flex pb-5">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_8176_74994)">
<path d="M28 0C12.5357 0 0 12.5362 0 28C0 43.4638 12.5357 56 28 56C43.4632 56 56 43.4638 56 28C56 12.5362 43.4632 0 28 0Z" fill="url(#paint0_linear_8176_74994)"/>
<path d="M28.004 2.42505C13.8775 2.42505 2.42969 13.8796 2.42969 27.9994C2.42969 42.1197 13.8775 53.5745 28.004 53.5745C42.1243 53.5745 53.5729 42.1197 53.5729 27.9994C53.5724 13.8796 42.1243 2.42505 28.004 2.42505Z" fill="url(#paint1_radial_8176_74994)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M50 28C50 40.1502 40.1502 50 28 50C15.8497 50 6 40.1502 6 28C6 15.8497 15.8497 6 28 6C40.1502 6 50 15.8497 50 28ZM34.0933 41.8104C35.3171 41.0797 36.4262 40.1359 37.3818 39.0224C38.2942 40.4685 40.1353 40.9769 41.0579 40.9769C42.4664 40.9769 43.209 39.6391 44.0125 38.1916L44.0125 38.1914L44.0134 38.1898C44.1349 37.9709 44.2578 37.7496 44.3846 37.5299C45.3504 35.8571 47.3435 32.3594 46.0764 31.1935C45.2539 30.4367 43.1282 29.5091 40.9892 30.4486C41.0481 29.8783 41.0784 29.298 41.0784 28.7097C41.0784 27.0677 40.8422 25.4881 40.4061 24.0121C42.9433 25.0049 44.657 25.5826 45.7417 24.3501C47.9723 21.8155 40.3174 9.04135 27.9998 9.04135C15.6822 9.04135 7.80595 21.6128 10.2579 24.3501C11.429 25.6575 13.0245 24.9644 15.5127 23.8835L15.6511 23.8234C15.1786 25.3532 14.9218 26.9975 14.9218 28.7097C14.9218 29.3013 14.9524 29.8847 15.012 30.4581C12.8658 29.5028 10.7287 30.4342 9.90335 31.1935C8.63625 32.3594 10.6293 35.8571 11.5951 37.5299C11.7223 37.7501 11.8454 37.9722 11.9672 38.1916C12.7708 39.6391 13.5133 40.9769 14.9218 40.9769C15.8474 40.9769 17.6972 40.4653 18.6066 39.0087C19.5649 40.1281 20.6781 41.0767 21.9069 41.8104C21.0461 42.5542 20.7006 43.5105 20.7006 44.5507C20.7006 46.908 26.4286 47.06 28.0001 47.06C29.5715 47.06 35.2996 46.9079 35.2996 44.5507C35.2996 43.5105 34.9542 42.5542 34.0933 41.8104ZM27.4929 21.0552C22.7031 21.0552 19.2019 22.3176 16.578 23.4253C15.9928 25.056 15.6703 26.84 15.6703 28.7097C15.6703 29.4597 15.7222 30.1958 15.8221 30.9138C16.6929 31.5129 17.5378 32.4716 18.2673 33.9309C19.1934 35.7832 19.2956 37.1886 18.9625 38.2376C19.9967 39.5031 21.2345 40.551 22.6166 41.3142C23.7638 40.6626 25.497 40.2673 28.0001 40.2673C30.5031 40.2673 32.2364 40.6627 33.3836 41.3142C34.7591 40.5546 35.9917 39.513 37.023 38.2556C36.683 37.2047 36.781 35.7938 37.7123 33.9309C38.4482 32.459 39.3014 31.4965 40.1802 30.8983C40.2787 30.1852 40.3298 29.4543 40.3298 28.7097C40.3298 26.9284 40.0371 25.2248 39.5033 23.6574C36.5632 22.5048 32.6409 21.0552 27.4929 21.0552ZM28 31.5C29.6569 31.5 31 30.1569 31 28.5C31 26.8431 29.6569 25.5 28 25.5C26.3431 25.5 25 26.8431 25 28.5C25 30.1569 26.3431 31.5 28 31.5Z" fill="#E9FF32"/>
</g>
<defs>
<linearGradient id="paint0_linear_8176_74994" x1="0" y1="28" x2="56" y2="28" gradientUnits="userSpaceOnUse">
<stop stop-color="#66686A"/>
<stop offset="0.0962" stop-color="#A3A5A7"/>
<stop offset="0.5427" stop-color="white"/>
<stop offset="0.9077" stop-color="#A3A5A7"/>
<stop offset="1" stop-color="#66686A"/>
</linearGradient>
<radialGradient id="paint1_radial_8176_74994" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(28.0011 27.9995) scale(28.0001 28.0001)">
<stop stop-color="#545758"/>
<stop offset="1" stop-color="#2F2A2B"/>
</radialGradient>
<clipPath id="clip0_8176_74994">
<rect width="56" height="56" fill="white"/>
</clipPath>
</defs>
</svg>

                
                   
<div className="d-flex flex-column ms-3">
<p>Drive Type</p>
<p>Four Wheel Drive</p>
</div>
               
            </div>
            <div className="d-flex pb-5">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_8176_74999)">
<path d="M27.9987 0.509033C12.8156 0.509033 0.507812 12.8168 0.507812 27.9999C0.507812 43.182 12.8156 55.491 27.9987 55.491C43.1808 55.491 55.4897 43.182 55.4897 27.9999C55.4897 12.8168 43.1808 0.509033 27.9987 0.509033Z" fill="url(#paint0_linear_8176_74999)"/>
<path d="M28.0039 2.88965C14.1343 2.88965 2.89453 14.1365 2.89453 27.999C2.89453 41.8626 14.1343 53.1095 28.0039 53.1095C41.8675 53.1095 53.1079 41.8626 53.1079 27.999C53.1074 14.1365 41.8675 2.88965 28.0039 2.88965Z" fill="url(#paint1_radial_8176_74999)"/>
<path d="M9.33984 27.7155C9.33984 27.3245 9.65704 27.0083 10.047 27.0083H29.451C29.842 27.0083 30.1581 27.3245 30.1581 27.7155C30.1581 28.1064 29.842 28.4226 29.451 28.4226H10.0465C9.65704 28.4226 9.33984 28.1054 9.33984 27.7155Z" fill="#E9FF32"/>
<path d="M15.6562 15.1841H16.4591V12.8199H15.7972V12.4126C16.1536 12.3444 16.4021 12.2538 16.6286 12.1189H17.1153V15.1841H17.8224V15.7156H15.6567V15.1841H15.6562Z" fill="white"/>
<path d="M25.3491 14.8556C25.564 15.0765 25.8409 15.2512 26.2029 15.2512C26.5933 15.2512 26.8647 15.048 26.8647 14.7085C26.8647 14.3353 26.6274 14.0981 25.8073 14.0981V13.6226C26.5144 13.6226 26.7461 13.3792 26.7461 13.0458C26.7461 12.7459 26.5429 12.5652 26.2146 12.5652C25.9315 12.5652 25.7111 12.7011 25.4906 12.9048L25.1572 12.5031C25.4626 12.2317 25.8073 12.0505 26.2375 12.0505C26.9273 12.0505 27.4028 12.3901 27.4028 13.0005C27.4028 13.4021 27.165 13.6735 26.7751 13.8262V13.8486C27.1992 13.9621 27.5214 14.2671 27.5214 14.7426C27.5214 15.3983 26.9502 15.7827 26.2604 15.7827C25.678 15.7827 25.2936 15.5571 25.0391 15.2741L25.3491 14.8556Z" fill="white"/>
<path d="M15.4538 43.3831C16.4546 42.4158 17.0824 41.782 17.0824 41.2332C17.0824 40.8544 16.8731 40.6116 16.4888 40.6116C16.2118 40.6116 15.9797 40.7974 15.7877 41.0133L15.4258 40.6513C15.7536 40.3006 16.082 40.0964 16.5738 40.0964C17.2636 40.0964 17.7106 40.5317 17.7106 41.1991C17.7106 41.8385 17.1165 42.4947 16.4042 43.2462C16.5911 43.2294 16.8283 43.2065 17.004 43.2065H17.8862V43.7614H15.4543V43.3831H15.4538Z" fill="white"/>
<path d="M27.4805 42.8342H27.0279V43.7618H26.417V42.8342H24.8281V42.3928L26.2531 40.1646H27.0279V42.3312H27.4805V42.8342ZM26.417 42.3307V41.5162C26.417 41.3065 26.4338 40.9781 26.4455 40.7693H26.4231C26.3325 40.9562 26.2312 41.1374 26.1288 41.3293L25.4726 42.3307H26.417Z" fill="white"/>
<path d="M39.6431 43.7618L38.8458 42.3139H38.2807V43.7618H37.625V40.0627H38.8748C39.6436 40.0627 40.2321 40.3341 40.2321 41.1593C40.2321 41.7249 39.9378 42.064 39.4964 42.2172L40.3792 43.7613H39.6431V43.7618ZM38.2802 41.7931H38.8061C39.3096 41.7931 39.586 41.5783 39.586 41.1598C39.586 40.7362 39.3096 40.5891 38.8061 40.5891H38.2802V41.7931Z" fill="white"/>
<path d="M34.7056 14.8674C34.9204 15.0706 35.1866 15.2518 35.5486 15.2518C35.9498 15.2518 36.2435 14.9973 36.2435 14.5625C36.2435 14.1323 35.9783 13.8895 35.5823 13.8895C35.3501 13.8895 35.2203 13.9516 35.0055 14.0926L34.6944 13.8946L34.8018 12.1194H36.7247V12.6677H35.3674L35.2936 13.5387C35.4458 13.4649 35.5818 13.4201 35.7686 13.4201C36.3846 13.4201 36.8997 13.7703 36.8997 14.5452C36.8997 15.3312 36.2945 15.7838 35.6332 15.7838C35.0503 15.7838 34.6714 15.5522 34.4062 15.2864L34.7056 14.8674Z" fill="white"/>
<path d="M16.8087 27.0088H16.1016V27.7159C16.1016 27.3249 16.4182 27.0088 16.8087 27.0088Z" fill="#E9FF32"/>
<path d="M17.5158 18.0131C17.5158 17.6226 17.1997 17.3059 16.8087 17.3059C16.4182 17.3059 16.1016 17.6226 16.1016 18.0131V25.9218H17.5153V18.0131H17.5158Z" fill="#E9FF32"/>
<path d="M16.1016 37.417C16.1016 37.808 16.4182 38.1241 16.8087 38.1241C17.1997 38.1241 17.5158 37.808 17.5158 37.417V29.5083H16.1021V37.417H16.1016Z" fill="#E9FF32"/>
<path d="M16.1016 27.7154V28.4225H16.8087C16.4182 28.4225 16.1016 28.1053 16.1016 27.7154Z" fill="#E9FF32"/>
<path d="M25.5273 37.417C25.5273 37.808 25.8434 38.1241 26.2344 38.1241C26.6254 38.1241 26.9416 37.808 26.9416 37.417V29.5083H25.5278V37.417H25.5273Z" fill="#E9FF32"/>
<path d="M26.9416 18.0131C26.9416 17.6226 26.6254 17.3059 26.2344 17.3059C25.8434 17.3059 25.5273 17.6226 25.5273 18.0131V25.9218H26.941V18.0131H26.9416Z" fill="#E9FF32"/>
<path d="M39.4332 27.7155C39.4332 28.1054 39.1171 28.4226 38.7266 28.4226H39.6292V27.7155C39.6292 27.3245 39.3131 27.0083 38.9221 27.0083C38.889 27.0083 38.8564 27.0134 38.8243 27.0185C39.168 27.0663 39.4332 27.3586 39.4332 27.7155Z" fill="#E9FF32"/>
<path d="M38.2148 37.8106C38.2148 38.2005 38.531 38.5167 38.9219 38.5167C39.3129 38.5167 39.6291 38.2005 39.6291 37.8106V29.5083H38.2153V37.8106H38.2148Z" fill="#E9FF32"/>
<path d="M25.5287 27.0088H17.5156V28.4225H25.5287V27.0088Z" fill="#E9FF32"/>
<path d="M38.2147 28.4226V27.7155C38.2147 27.3586 38.48 27.0663 38.8236 27.0185C38.7915 27.0134 38.7589 27.0083 38.7258 27.0083H26.9414V28.4221H38.2147V28.4226Z" fill="#E9FF32"/>
<path d="M16.8087 28.4225H17.5158V27.0088H16.8087C16.4182 27.0088 16.1016 27.3249 16.1016 27.7159C16.1016 28.1053 16.4182 28.4225 16.8087 28.4225Z" fill="#E9FF32"/>
<path d="M26.941 27.0088H25.5273V28.4225H26.941V27.0088Z" fill="#E9FF32"/>
<path d="M38.2148 27.7153V28.4224H38.7259C39.1164 28.4224 39.4326 28.1052 39.4326 27.7153C39.4326 27.3584 39.1673 27.0662 38.8242 27.0183C38.4806 27.0662 38.2148 27.3584 38.2148 27.7153Z" fill="#E9FF32"/>
<path d="M36.3718 18.0131C36.3718 17.6226 36.0552 17.3059 35.6642 17.3059C35.2737 17.3059 34.957 17.6226 34.957 18.0131V25.9218H36.3713V18.0131H36.3718Z" fill="#E9FF32"/>
<path d="M34.957 27.7155C34.957 28.1054 35.2737 28.4226 35.6642 28.4226C36.0552 28.4226 36.3718 28.1054 36.3718 27.7155V27.0083H34.9576V27.7155H34.957Z" fill="#E9FF32"/>
</g>
<defs>
<linearGradient id="paint0_linear_8176_74999" x1="0.507812" y1="28" x2="55.4897" y2="28" gradientUnits="userSpaceOnUse">
<stop stop-color="#66686A"/>
<stop offset="0.0962" stop-color="#A3A5A7"/>
<stop offset="0.5427" stop-color="white"/>
<stop offset="0.9077" stop-color="#A3A5A7"/>
<stop offset="1" stop-color="#66686A"/>
</linearGradient>
<radialGradient id="paint1_radial_8176_74999" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(28.001 27.9997) scale(27.491 27.4911)">
<stop stop-color="#545758"/>
<stop offset="1" stop-color="#2F2A2B"/>
</radialGradient>
<clipPath id="clip0_8176_74999">
<rect width="56" height="56" fill="white"/>
</clipPath>
</defs>
</svg>

                
                   
<div className="d-flex flex-column ms-3">
<p>Transmission</p>
<p>Automatic</p>
</div>
               
            </div>
            <div className="d-flex pb-5">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_8176_75004)">
<path d="M28 0C12.5357 0 0 12.5362 0 28C0 43.4638 12.5357 56 28 56C43.4632 56 56 43.4638 56 28C56 12.5362 43.4632 0 28 0Z" fill="url(#paint0_linear_8176_75004)"/>
<path d="M28.0041 2.42505C13.8775 2.42505 2.42969 13.8796 2.42969 27.9994C2.42969 42.1197 13.8775 53.5745 28.0041 53.5745C42.1243 53.5745 53.5725 42.1197 53.5725 27.9994C53.572 13.8796 42.1243 2.42505 28.0041 2.42505Z" fill="url(#paint1_radial_8176_75004)"/>
<path d="M46.3867 22.1993L38.8893 24.2468L30.1334 26.5393L27.6012 24.509H23.6441V22.3103H27.1588C27.6684 22.3103 28.0813 21.8745 28.0813 21.3369C28.0813 20.7988 27.6679 20.363 27.1588 20.363H18.1067C17.5976 20.363 17.1842 20.7988 17.1842 21.3369C17.1842 21.8745 17.5976 22.3103 18.1067 22.3103H21.7976V24.509H16.7286L16.6807 22.9359L8.75724 19.6589L6.42969 25.8342L15.0155 28.8093L15.2364 35.99H33.161L41.7993 25.4646L45.8083 24.3695L48.2479 27.0234L49.5721 25.6677L46.3867 22.1993ZM8.86974 24.6297L9.79324 22.1799L14.876 24.2825L14.9503 26.7378L8.86974 24.6297Z" fill="#E9FF32"/>
</g>
<defs>
<linearGradient id="paint0_linear_8176_75004" x1="0" y1="28" x2="56" y2="28" gradientUnits="userSpaceOnUse">
<stop stop-color="#66686A"/>
<stop offset="0.0962" stop-color="#A3A5A7"/>
<stop offset="0.5427" stop-color="white"/>
<stop offset="0.9077" stop-color="#A3A5A7"/>
<stop offset="1" stop-color="#66686A"/>
</linearGradient>
<radialGradient id="paint1_radial_8176_75004" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(28.0011 27.9995) scale(28.0001 28.0001)">
<stop stop-color="#545758"/>
<stop offset="1" stop-color="#2F2A2B"/>
</radialGradient>
<clipPath id="clip0_8176_75004">
<rect width="56" height="56" fill="white"/>
</clipPath>
</defs>
</svg>

                
                   
<div className="d-flex flex-column ms-3">
<p>Fuel Type</p>
<p>Regular Unleaded</p>
</div>
               
            </div>
          
            <div className="d-flex">
            <svg width="100%" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M28 0C12.5357 0 0 12.5362 0 28C0 43.4638 12.5357 56 28 56C43.4632 56 56 43.4638 56 28C56 12.5362 43.4632 0 28 0Z" fill="url(#paint0_linear_8332_62463)"/>
<path d="M28.0041 2.42505C13.8775 2.42505 2.42969 13.8796 2.42969 27.9994C2.42969 42.1197 13.8775 53.5745 28.0041 53.5745C42.1243 53.5745 53.5725 42.1197 53.5725 27.9994C53.572 13.8796 42.1243 2.42505 28.0041 2.42505Z" fill="url(#paint1_radial_8332_62463)"/>
<path d="M44.1241 23.8963C43.3543 23.8963 42.7307 24.52 42.7307 25.2882V28.7353H40.3645C40.3645 28.2913 40.3645 27.6483 40.3645 27.239V20.2675C40.3645 19.8262 40.0025 19.4647 39.5637 19.4647H31.2451V17.0985H34.8296C35.5983 17.0985 36.2215 16.4748 36.2215 15.7066C36.2215 14.9369 35.5978 14.3142 34.8296 14.3142H25.0123C24.2431 14.3142 23.6194 14.9374 23.6194 15.7066C23.6194 16.4748 24.2431 17.0985 25.0123 17.0985H28.4599V19.4647H23.9687C23.5278 19.4647 22.9103 19.7193 22.5962 20.0278L19.1435 23.4265C18.8294 23.7365 18.2109 23.9895 17.77 23.9895H16.0319C15.5911 23.9895 15.2296 24.351 15.2296 24.7923V28.7358H12.8639V25.2887C12.8639 24.52 12.2392 23.8969 11.471 23.8969C10.7013 23.8969 10.0781 24.5205 10.0781 25.2887V35.1035C10.0781 35.8737 10.7018 36.4958 11.471 36.4958C12.2392 36.4958 12.8639 35.8732 12.8639 35.1035V31.52H15.2296V31.9588C15.2296 32.1798 15.2296 32.3493 15.2296 32.4455C15.2296 32.4374 15.2296 32.4506 15.2296 32.4883C15.2296 32.5 15.2296 32.5132 15.2296 32.53C15.2296 32.6262 15.2296 32.7963 15.2296 33.0182V35.4659C15.2296 35.9068 15.5911 36.2667 16.0319 36.2667H17.77C18.2109 36.2667 18.8294 36.5208 19.1435 36.8308L22.5962 40.23C22.9103 40.539 23.5278 40.7921 23.9687 40.7921H33.3314C33.7712 40.7921 34.3791 40.5289 34.682 40.2081L39.8151 34.7374C40.1165 34.4162 40.3639 33.7921 40.3639 33.3507V31.5195H42.7302V35.103C42.7302 35.8732 43.3543 36.4953 44.1236 36.4953C44.8918 36.4953 45.5154 35.8727 45.5154 35.103V25.2887C45.5159 24.52 44.8923 23.8963 44.1241 23.8963Z" fill="#E9FF32"/>
<defs>
<linearGradient id="paint0_linear_8332_62463" x1="0" y1="28" x2="56" y2="28" gradientUnits="userSpaceOnUse">
<stop stop-color="#66686A"/>
<stop offset="0.0962" stop-color="#A3A5A7"/>
<stop offset="0.5427" stop-color="white"/>
<stop offset="0.9077" stop-color="#A3A5A7"/>
<stop offset="1" stop-color="#66686A"/>
</linearGradient>
<radialGradient id="paint1_radial_8332_62463" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(28.0011 27.9995) scale(28.0001 28.0001)">
<stop stop-color="#545758"/>
<stop offset="1" stop-color="#2F2A2B"/>
</radialGradient>
</defs>
</svg>

                
                   
<div className="d-flex flex-column ms-3">
<p>Engine</p>
<p>4L V-6 DOHC, VVT-i variable valve control, engine with 270HP</p>
</div>
               
            </div>
          
          




          
         


        </div>
    </div>
</div>
</section>


<section>
<div className="col-lg-12 ms-0 px-0">
    <div className='d-flex bg-white justify-content-evenly p-4 my-3 border-radius-25'>
    <div className='tab-deatil'>
        <img src='../../media/car-black.png'/>
        <p className='text-white'> 
        Orig Window Sticker</p>
      
        </div>
        <div className='tab-deatil'>
        <img src='../../media/Manufacturer brochure.png'/>
        <p className='text-white'> 
        Orig Window Sticker</p>
      
        </div>
        <div className='tab-deatil'>
        <img src='../../media/Manufacturer brochure.png'/>
        <p className='text-white'> 
        Orig Window Sticker</p>
      
        </div>
        <div className='tab-deatil bg-yellow-detail'>
        <img src='../../media/car-black.png'/>
        <p className='text-white'> 
        Orig Window Sticker</p>
      
        </div>


</div>
</div>
</section>


<section>
<div class="accordion mb-3 px-0 accordion-detail-car" id="accordionExample">
    <div class="accordion-item p-2">
      <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne-acc" aria-expanded="true" aria-controls="collapseOne">
        Car Summary
        </button>
      </h2>
      <div id="collapseOne-acc" class="accordion-collapse collapse show" aria-labelledby="headingOne">
        <div class="accordion-body d-flex justify-content-between">
         
         <div className="row summary-row gy-4">
            <div className="col-lg-4">
            <p> VIN</p>
        <p>1C4HJXDG1NW257544</p>
             </div>
             <div className="col-lg-4">
            <p> VIN</p>
        <p>1C4HJXDG1NW257544</p>
             </div>
             <div className="col-lg-4">
            <p> VIN</p>
        <p>1C4HJXDG1NW257544</p>
             </div>
             <div className="col-lg-4">
            <p> VIN</p>
        <p>1C4HJXDG1NW257544</p>
             </div>
             <div className="col-lg-4">
            <p> VIN</p>
        <p>1C4HJXDG1NW257544</p>
             </div>

                </div>


      

       
        </div>
      </div>
    </div>
  </div>
</section>

<section>
<div className="delivery-estimates d-flex justify-content-start
 bg-white p-5">
  
<div>   <svg width="35" height="35" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M55.0834 27.4946L51.5162 16.2772H40.8541L41.7149 12.9816L9.58859 12.6509L4.80859 39.7772H11.2947C10.9862 41.9724 11.8522 43.9708 13.5072 44.5215C15.4547 45.1695 17.7404 43.5707 18.6121 40.9504C18.736 40.5682 18.8246 40.1755 18.8768 39.7772H42.2944C41.9859 41.9724 42.8519 43.9708 44.5069 44.5215C46.4544 45.1695 48.7401 43.5707 49.6118 40.9504C49.7357 40.5682 49.8243 40.1755 49.8765 39.7772H52.884L55.0834 27.4946Z" fill="#CAFC9C"/>
<path d="M15.6077 38.9506C16.4795 36.3304 15.6074 33.681 13.6599 33.0331C11.7124 32.3851 9.42685 33.9839 8.55506 36.6041C7.68328 39.2243 8.55536 41.8737 10.5029 42.5217C12.4504 43.1696 14.736 41.5708 15.6077 38.9506Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M45.9827 38.9506C46.8545 36.3304 45.9824 33.681 44.0349 33.0331C42.0874 32.3851 39.8018 33.9839 38.9301 36.6041C38.0583 39.2243 38.9304 41.8737 40.8779 42.5217C42.8254 43.1696 45.111 41.5708 45.9827 38.9506Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.0938 37.7771H38.6591" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M46.2578 37.7771H50.7685" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.80469 11H39.1437L34.2997 37.532" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.36238 27.4951L3.48438 37.7771H8.28338" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M39.2578 15.7339H48.7318L52.6948 26.9799L50.7688 37.5319" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M37.168 24.7063H51.4861" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.10156 16.2771H10.7146" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1 21.886H8.613" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>
   <div className="estimate-content ms-3">
    <h4>Delivery Estimates</h4>
    <p>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='me-1'>
<path d="M6.205 4.41735C9.40201 1.19422 14.582 1.19422 17.779 4.41734C19.1269 5.77628 19.7753 7.22865 19.9501 8.69624C20.1268 10.18 19.8264 11.7453 19.1655 13.3135C17.8356 16.4689 15.1161 19.4644 12.4502 21.4573C12.1706 21.6663 11.7957 21.6671 11.5187 21.4638C8.84377 19.5 6.14073 16.4913 4.82341 13.3203C3.52512 10.1951 3.60141 7.0422 6.205 4.41735Z" stroke="#53119B" stroke-width="2"/>
<circle cx="12" cy="9.25781" r="2.925" stroke="#53119B" stroke-width="1.85"/>
</svg>
Your city:to <span>THISCar Delivery Center, Tomball, TX</span></p>
    <p>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='me-1'>
<circle cx="12" cy="12" r="10" stroke="#53119B" stroke-width="2"/>
<path d="M11.5 7L11.5 13C11.5 13.2761 11.7239 13.5 12 13.5H16" stroke="#53119B" stroke-width="2" stroke-linecap="round"/>
</svg>
Delivery Estimate: 1–3 Days</p>
    <p>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='me-1'>
<path d="M2 8C2 6.34315 3.34315 5 5 5H19C20.6569 5 22 6.34315 22 8V16C22 17.6569 20.6569 19 19 19H5C3.34315 19 2 17.6569 2 16V8Z" stroke="#53119B" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
<path d="M2 10H22" stroke="#53119B" stroke-width="2" stroke-linecap="round"/>
</svg>
Delivery: $727</p>
<p><span><b>More About Delivery Estimates </b><i class="fa fa-angle-right" aria-hidden="true"></i></span> </p>
{/* <div class="paragraph-container">
  <p class="paragraph">This is a sample paragraph.</p>
  <span class="arrow">&#8594;</span>
</div> */}

   </div>
</div>
</section>



<div class="accordion accordion-detail-car" id="accordionExample">
    <div class="accordion-item mt-3 p-2">
      <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
   <span class="left-heading"> Convenience</span>
          <span class="right-heading">Antenna Fixed audio antenna</span>
        </button>
      </h2>
      <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne">
        <div class="accordion-body">
          Content for section 1 goes here.
        </div>
      </div>
    </div>
  </div>
  <div class="accordion accordion-detail-car" id="accordionExample">
    <div class="accordion-item mt-3 p-2">
      <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
   <span class="left-heading">Safety and security</span>
          <span class="right-heading">3-point seatbelt Rear seat center 3-point seatbelt</span>
        </button>
      </h2>
      <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne">
        <div class="accordion-body">
          Content for section 1 goes here.
        </div>
      </div>
    </div>
  </div>
  <div class="accordion accordion-detail-car" id="accordionExample">
    <div class="accordion-item mt-3 p-2">
      <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
   <span class="left-heading">Powertrain and mechanical</span>
          <span class="right-heading">4WD type Command-Trac part-time 4WD</span>
        </button>
      </h2>
      <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne">
        <div class="accordion-body">
          Content for section 1 goes here.
        </div>
      </div>
    </div>
  </div>
  <div class="accordion accordion-detail-car" id="accordionExample">
    <div class="accordion-item mt-3 p-2">
      <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
   <span class="left-heading">Comfort</span>
     
        </button>
      </h2>
      <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne">
        <div class="accordion-body">
        <div className='d-flex justify-content-between list_detail_product'>
        <ul>
            <li>
            Air conditioning 
            </li>
            <li>
            Armrests front center Front seat center armrest
            </li>
            <li>
            Armrests front storage Front seat armrest storage
            </li>
            <li>
            Climate control Manual climate control
            </li>
            <li>
            Console insert material Metal-look console insert
            </li>
            <li>
            Driver lumbar Manual driver seat lumbar
            </li>

            <li>
            Driver seat direction Driver seat with 6-way directional controls
            </li>
            <li>
            Floor coverage Full floor coverage
            </li>
        </ul>
        <ul>
            <li>
            Air conditioning 
            </li>
            <li>
            Armrests front center Front seat center armrest
            </li>
            <li>
            Armrests front storage Front seat armrest storage
            </li>
            <li>
            Climate control Manual climate control
            </li>
            <li>
            Console insert material Metal-look console insert
            </li>
            <li>
            Driver lumbar Manual driver seat lumbar
            </li>

            <li>
            Driver seat direction Driver seat with 6-way directional controls
            </li>
            <li>
            Floor coverage Full floor coverage
            </li>
        </ul>
        <ul>
            <li>
            Air conditioning 
            </li>
            <li>
            Armrests front center Front seat center armrest
            </li>
            <li>
            Armrests front storage Front seat armrest storage
            </li>
            <li>
            Climate control Manual climate control
            </li>
            <li>
            Console insert material Metal-look console insert
            </li>
            <li>
            Driver lumbar Manual driver seat lumbar
            </li>

            <li>
            Driver seat direction Driver seat with 6-way directional controls
            </li>
            <li>
            Floor coverage Full floor coverage
            </li>
        </ul>
      </div>
        </div>
      </div>
    </div>
  </div>
  <div class="accordion accordion-detail-car" id="accordionExample">
    <div class="accordion-item mt-3 p-2">
      <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
   <span class="left-heading">In-car entertaiment</span>
          <span class="right-heading">Antenna Fixed audio antenna</span>
        </button>
      </h2>
      <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne">
        <div class="accordion-body">
          Content for section 1 goes here.
        </div>
      </div>
    </div>
  </div>
  <div class="accordion accordion-detail-car" id="accordionExample">
    <div class="accordion-item mt-3 p-2">
      <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
   <span class="left-heading">Original warranty</span>
          <span class="right-heading">Original warranty</span>
        </button>
      </h2>
      <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne">
        <div class="accordion-body">
          Content for section 1 goes here.
        </div>
      </div>
    </div>
  </div>
  <div class="accordion accordion-detail-car" id="accordionExample">
    <div class="accordion-item mt-3 p-2">
      <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
   <span class="left-heading">Exterior and appearance</span>
          <span class="right-heading">Original warranty</span>
        </button>
      </h2>
      <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne">
        <div class="accordion-body">
          Content for section 1 goes here.
        </div>
      </div>
    </div>
  </div>


<div className='mt-3'><Faq/></div>
<div className="col-lg-12 d-flex justify-content-start px-0 mt-3 mb-3"><button className='btn custom_btn detail-btn'>
See Full FAQ
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='25'
                height='25'
                fill='currentColor'
                className='bi bi-arrow-right-short'
                viewBox='0 0 16 16'
              >
                <path
                  fillRule='evenodd'
                  d='M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z'
                />
              </svg>
            </button></div>
        
            </div>
        </div>
    </div>
  )
}

export default CarDetails