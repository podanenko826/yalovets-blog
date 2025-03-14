import { DialogButton, insertJsx$, usePublisher } from "@mdxeditor/editor";

import { SlSocialYoutube } from "react-icons/sl";

export default function YouTubeEmbed({ id }: { id: string }){
    return (
          <div>
              <iframe
                className="aspect-video"
                src={`https://www.youtube.com/embed/${id}`}
                width="100%"
                height={400}
                title="YouTube Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
        </div>
    );
};

export const YouTubeButton = () => {
  // grab the insertDirective action (a.k.a. publisher) from the 
  // state management system of the directivesPlugin
  const insertJsx = usePublisher(insertJsx$)

  return (
      <DialogButton
          tooltipTitle="Insert Youtube video"
          submitButtonTitle="Insert video"
          dialogInputPlaceholder="Paste the youtube video URL"
          buttonContent={<SlSocialYoutube className='editor-youtube-icon' />}
          onSubmit={(url) => {
              const videoId = new URL(url).searchParams.get('v')
              if (videoId) {
                  insertJsx({
                      name: 'YouTubeEmbed',
                      kind: 'flow',
                      props: { id: videoId },
                  })
              } else {
                  alert('Invalid YouTube URL')
              }
          }}
      />
  )
}