import { SanityImageURL } from "./Sanity";

import Image from "next/image";

export function SanityImage({ src, defaultImage, ...rest }) {
    const url = SanityImageURL(src, defaultImage, rest.width, rest.height);

    return (
        <Image
            {...rest}
            src={url}
            width={rest.width}
            height={rest.height}
            alt={rest.alt}
        />
    );
}
