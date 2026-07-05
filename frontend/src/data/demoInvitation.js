export const demoWeddingInvitation = {
  event: {
    id: 1,
    event_name: 'Kevin & Andy',
    event_type: 'wedding',
    event_date: '2027-07-25T16:00:00',
    slug: 'john-jane',
    invite_code: 'DEMO2027',
    status: 'published',
  },
  invitation: {
    cover_image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=80',
    background_video: '',
    music_url: '',
    primary_color: '#B47B36',
    secondary_color: '#F4EEE7',
    font_family: 'Playfair Display',
    opening_line: 'With great joy, we invite you',
    hero_caption: 'In the union of',
    quote: 'So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate.',
    quote_source: 'Matthew 19:6',
    rsvp_note: 'You are special to us. Kindly confirm your attendance below.',
    coordinator: 'Queens Banquet Events',
    coordinator_phone: '+63 917 000 0000',
    dress_code: 'Formal / Black Tie Optional',
    story: {
      title: 'I have finally found you',
      sections: [
        {
          heading: 'Together with our beloved parents',
          content: 'Together with our beloved parents, we warmly invite you to join us on the special day of our union in marriage.',
        },
        {
          heading: 'The Proposal',
          content: 'On a sunset cruise in Palawan, John got down on one knee as the sky turned gold. Jane said yes before he finished the question.',
        },
        {
          heading: 'Our Journey',
          content: 'Years of adventures, late-night talks, and building a life together have led us to this beautiful day.',
        },
      ],
    },
    venue: {
      ceremony: { name: 'San Agustin Church', address: 'General Luna St, Intramuros, Manila', time: '3:00 PM', map_url: 'https://maps.google.com' },
      reception: { name: 'Queens Banquet Garden Estate', address: 'Taguig City, Metro Manila', time: '6:00 PM', map_url: 'https://maps.google.com' },
    },
    program: [
      { time: '3:00 PM', title: 'Wedding Ceremony' },
      { time: '4:00 PM', title: 'Pictorial' },
      { time: '4:30 PM', title: 'Cocktail Hour' },
      { time: '6:00 PM', title: 'Program Proper' },
      { time: '7:00 PM', title: 'Dinner' },
      { time: '8:30 PM', title: 'Same Day Edit Photo and Video' },
    ],
    entourage: {
      principal_sponsors: ['Gaudencio M. Tullao', 'Lira R. Tullao', 'Dolores G. Serrano', 'Gina P. Ayuste'],
      secondary_sponsors: ['Berlin Reyes', 'Mae Larra Sumicad', 'Janzen Luigi Espartinez'],
      best_man: 'Carlos Mendoza',
      maid_of_honor: 'Isabella Torres',
      groomsmen: ['James Lee', 'Mark Rivera', 'David Kim'],
      bridesmaids: ['Sophia Cruz', 'Anna Park', 'Mia Santos'],
      ring_bearer: 'Lucas Mendoza',
      flower_girl: 'Emma Torres',
    },
    gallery: [
      { caption: 'Groom', type: 'engagement', image: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=80' },
      { caption: 'Bride', type: 'prenup', image: 'https://images.unsplash.com/photo-1523264766116-1e09b3145b84?auto=format&fit=crop&w=900&q=80' },
      { caption: 'Countdown', type: 'memories', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80' },
      { caption: 'Happy Moments', type: 'memories', image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80' },
    ],
    videos: [
      { title: 'Pre-Wedding Film', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ],
    gift_registry: {
      cash_gift: true,
      gcash: '0917-123-4567',
      bank: 'BDO - John Santos - 1234-5678-9012',
      preferences: 'Your presence and prayers are all that we request, but if you desire to give nonetheless, a monetary gift is appreciated.',
    },
    attire: {
      primary: 'Primary sponsors: champagne, gold, cream, and beige.',
      guests: 'Ladies: semi-formal long dress or pantsuit. Gentlemen: long sleeves or polo with slacks.',
      reminders: 'Although we love your little ones, please understand that this is an adult-only affair.',
    },
    faqs: [
      { question: 'Can I bring a plus one?', answer: 'Please refer to the name listed on your invitation.' },
      { question: 'Where should I stay?', answer: 'Nearby hotel recommendations will be shared by the coordinator upon request.' },
      { question: 'Will transportation be provided?', answer: 'Kindly coordinate with the event team for shuttle details.' },
      { question: 'Who can we contact on the day of the event?', answer: 'Please contact Queens Banquet Events for assistance.' },
    ],
    qr_enabled: 1,
  },
  guest_messages: [
    { guest_name: 'Queens Banquet', message: 'We are excited to be part of your most special day!', created_at: '2027-06-01' },
    { guest_name: 'Maria Garcia', message: 'Wishing you both a lifetime of love and happiness!', created_at: '2027-06-02' },
    { guest_name: 'Pedro Reyes', message: 'Congratulations! Cannot wait to celebrate with you.', created_at: '2027-06-03' },
  ],
};

export const demoDebutInvitation = {
  ...demoWeddingInvitation,
  event: {
    ...demoWeddingInvitation.event,
    event_name: 'Maria at 18',
    event_type: 'debut',
    slug: 'maria-at-18',
    event_date: '2027-03-15T18:00:00',
  },
  invitation: {
    ...demoWeddingInvitation.invitation,
    primary_color: '#C27691',
    opening_line: 'You are warmly invited',
    hero_caption: 'To celebrate',
    story: {
      title: 'A beautiful chapter begins',
      sections: [
        { heading: 'My Journey', content: 'Eighteen years of blessings, laughter, and cherished memories. Today I step into a new chapter of life.' },
        { heading: 'Dreams Ahead', content: 'I dream of making a difference, one step at a time, with the love and support of family and friends.' },
      ],
    },
    entourage: null,
  },
};

export const demoBirthdayInvitation = {
  ...demoWeddingInvitation,
  event: {
    ...demoWeddingInvitation.event,
    event_name: "Josh's 7th Birthday",
    event_type: 'birthday',
    slug: 'josh-7th-birthday',
    event_date: '2027-08-10T14:00:00',
  },
  invitation: {
    ...demoWeddingInvitation.invitation,
    primary_color: '#D76549',
    opening_line: 'Come celebrate with us',
    hero_caption: 'As we mark',
    story: {
      title: 'Seven wonderful years',
      sections: [
        { heading: 'Turning Seven', content: 'Josh loves dinosaurs, building blocks, and making everyone laugh. Join us for a fun-filled celebration.' },
      ],
    },
    entourage: null,
  },
};
