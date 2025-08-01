const ruleData = {
      train: {
        title: "Train Rules in Japan",
        description: "Trains in Japan are clean, quiet, and punctual.",
        subtypes: {
          shinkansen: {
            title: "Shinkansen (Bullet Train)",
            rules: [
              "Reserve seats for long-distance travel.",
              "Store luggage in designated spaces.",
              "Eating and drinking is allowed — use good manners.",
              "Be quiet — many people are resting or working.",
              "Do not talk on the phone in your seat — use the deck."
            ]
          },
          local: {
            title: "Local/Subway Trains",
            rules: [
              "No eating or drinking.",
              "Hold backpacks in front during rush hour.",
              "Use manner mode on phones.",
              "Line up at platform queues.",
              "Offer seats in priority sections."
            ]
          }
        }
      },
      car: {
        title: "Car Rules in Japan",
        description: "Cars include private cars, taxis, buses, and rentals.",
        subtypes: {
          bus: {
            title: "Bus",
            rules: [
              "Enter through the rear and exit at the front (in most cities).",
              "Pay the fare using IC card or cash.",
              "Remain quiet during the ride.",
              "Give up priority seating if needed.",
              "Press the stop button in advance before your stop."
            ]
          },
          taxi: {
            title: "Taxi",
            rules: [
              "The left rear door opens/closes automatically — don’t touch it.",
              "Seatbelts are required in all seats.",
              "Tipping is not required.",
              "Cash and IC cards are accepted in most taxis.",
              "Tell the destination clearly or show a map."
            ]
          },
          rental: {
            title: "Rental Car",
            rules: [
              "International or Japanese license is required.",
              "Drive on the left side of the road.",
              "Follow all speed limits and traffic signals.",
              "Refuel before returning the car.",
              "Check for damage before/after renting."
            ]
          }
        }
      },
      motorcycle: {
        title: "Motorcycle Rules in Japan",
        description: "Motorcycles include 50cc bikes, scooters, and electric types.",
        subtypes: {
          cc50: {
            title: "50cc Bikes",
            rules: [
              "Must stay under 30 km/h.",
              "Avoid highways — not allowed.",
              "License is required (Class 1 small motorcycle)."
            ]
          },
          scooter: {
            title: "Scooter",
            rules: [
              "Helmet is mandatory.",
              "Drive in the traffic lane, not the sidewalk.",
              "Use turn signals and obey lights/signs."
            ]
          },
          electric: {
            title: "Electric Bikes",
            rules: [
              "Helmet required if speed > 20 km/h.",
              "Pedal-assist bikes follow bicycle rules.",
              "Charge batteries properly and follow local parking rules."
            ]
          }
        }
      },
      airplane: {
        title: "Airplane Rules in Japan",
        description: "Japan’s air transport includes domestic and international flights.",
        subtypes: {
          domestic: {
            title: "Domestic Flights",
            rules: [
              "Arrive 1 hour early for check-in.",
              "Carry-on limits: 1 bag + personal item.",
              "Use electronic devices in airplane mode.",
              "Board when your group is called."
            ]
          },
          international: {
            title: "International Flights",
            rules: [
              "Arrive 2–3 hours early.",
              "Pass through immigration and customs.",
              "Check for prohibited items in carry-on.",
              "Passport and visa may be required."
            ]
          }
        }
      },
      boat: {
        title: "Boat Rules in Japan",
        description: "Boats include ferries, yachts, and water buses.",
        subtypes: {
          ferry: {
            title: "Ferry",
            rules: [
              "Arrive at the dock early.",
              "Keep your ticket or QR code handy.",
              "Stay seated while moving unless permitted.",
              "Don’t block aisles with luggage."
            ]
          },
          yacht: {
            title: "Yacht/Cruise",
            rules: [
              "Follow the captain’s instructions.",
              "No smoking unless in designated area.",
              "Life vests may be required.",
              "Respect the quiet and scenery."
            ]
          },
          waterbus: {
            title: "Water Bus",
            rules: [
              "Board using IC card or ticket.",
              "No loud talking or music.",
              "Eating may be restricted.",
              "Yield seats to those in need."
            ]
          }
        }
      }
    };

    document.querySelectorAll('.card-link').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const type = this.dataset.type;
        const data = ruleData[type];

        if (!data) return;

        const box = document.getElementById("rule-box");
        box.innerHTML = `
          <h2>${data.title}</h2>
          <p>${data.description}</p>
          ${
            data.subtypes
              ? Object.values(data.subtypes).map(sub => `
                  <h3>${sub.title}</h3>
                  <ul>${sub.rules.map(rule => `<li>${rule}</li>`).join('')}</ul>
                `).join('')
              : `<ul>${data.rules.map(rule => `<li>${rule}</li>`).join('')}</ul>`
          }
        `;
        box.style.display = 'block';
        box.scrollIntoView({ behavior: "smooth" });
      });
    });