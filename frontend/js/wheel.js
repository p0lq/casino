// Fortune Wheel — always lands on "10% Скидка" (segment index 1, right after the car)
const WHEEL = {
  canvas: null, ctx: null,
  spinning: false,
  currentAngle: 0,
  bookingId: null,

  SEGMENTS: [
    { label: '🚗 Автомобиль', color: '#C8956C', textColor: '#fff' },
    { label: '10%\nСкидка',   color: '#6B3A2A', textColor: '#F5F0E8' },
    { label: '☕ Напиток',    color: '#D4A76A', textColor: '#2C1810' },
    { label: '50%\nСкидка',   color: '#C8956C', textColor: '#fff' },
    { label: 'Ещё раз',       color: '#E8DDD0', textColor: '#6B3A2A' },
    { label: '20%\nСкидка',   color: '#6B3A2A', textColor: '#F5F0E8' },
    { label: '🍰 Десерт',     color: '#D4A76A', textColor: '#2C1810' },
    { label: '🎁 Сюрприз',   color: '#C8956C', textColor: '#fff' }
  ],

  init(canvasId, bookingId) {
    this.canvas    = document.getElementById(canvasId);
    this.ctx       = this.canvas.getContext('2d');
    this.bookingId = bookingId;
    this.spinning  = false;
    this.currentAngle = 0;
    this.draw(0);
  },

  draw(angle) {
    const { ctx, canvas, SEGMENTS } = this;
    const n   = SEGMENTS.length;
    const arc = (2 * Math.PI) / n;
    const cx  = canvas.width / 2;
    const cy  = canvas.height / 2;
    const r   = cx - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    SEGMENTS.forEach((seg, i) => {
      const start = angle + i * arc - Math.PI / 2;
      const end   = start + arc;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = seg.textColor;
      const lines = seg.label.split('\n');
      const fontSize = r < 150 ? 11 : 13;
      ctx.font = `bold ${fontSize}px Poppins, sans-serif`;
      lines.forEach((line, li) => {
        ctx.fillText(line, r - 12, (li - (lines.length - 1) / 2) * (fontSize + 2));
      });
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#6B3A2A';
    ctx.fill();
    ctx.strokeStyle = '#D4A76A';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#F5F0E8';
    ctx.font = 'bold 9px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('COFFESINO', cx, cy + 3);

    // Pointer
    const px = cx;
    const py = 8;
    ctx.beginPath();
    ctx.moveTo(px, py + 22);
    ctx.lineTo(px - 10, py);
    ctx.lineTo(px + 10, py);
    ctx.closePath();
    ctx.fillStyle = '#6B3A2A';
    ctx.fill();
    ctx.strokeStyle = '#D4A76A';
    ctx.lineWidth = 2;
    ctx.stroke();
  },

  spin(onDone) {
    if (this.spinning) return;
    this.spinning = true;

    const n   = this.SEGMENTS.length;
    const arc = (2 * Math.PI) / n;

    // Target: land on segment 1 (10% скидка)
    // Segment 1 center angle (from top): arc * 1 + arc/2 = arc * 1.5
    // We need currentAngle % (2π) such that segment 1 is under pointer
    const targetSegCenter = arc * 1.5; // segment 1 center at top
    const fullSpins = 5 * 2 * Math.PI;
    // Near-miss effect: add extra so wheel "hesitates" near car then rolls past
    const nearMissExtra = arc * 0.78; // almost reaches car, then slips to segment 1
    const targetAngle   = fullSpins + targetSegCenter + nearMissExtra;

    const duration  = 6500;
    const startTime = performance.now();
    const startAngle = this.currentAngle;

    const easeWithHesitation = (t) => {
      // Standard ease-out for first 80%, then hesitation near car, then small roll
      if (t < 0.75) {
        return 1 - Math.pow(1 - t / 0.75, 3);
      } else if (t < 0.88) {
        // Dramatic slowdown (almost stopped near car)
        const p = (t - 0.75) / 0.13;
        return (1 - Math.pow(1 - 1, 3)) + p * 0.08;
      } else {
        // Final roll past car to land on 10%
        const p = (t - 0.88) / 0.12;
        return 0.97 + p * 0.03;
      }
    };

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeWithHesitation(progress);

      this.currentAngle = startAngle + targetAngle * eased;
      this.draw(this.currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.spinning = false;
        onDone();
      }
    };

    requestAnimationFrame(animate);
  },

  async show(bookingId) {
    this.bookingId = bookingId;
    const modal = document.getElementById('wheelModal');
    modal.classList.add('active');
    setTimeout(() => this.init('wheelCanvas', bookingId), 100);

    document.getElementById('wheelSpinBtn').onclick = async () => {
      if (this.spinning) return;
      document.getElementById('wheelSpinBtn').disabled = true;
      document.getElementById('wheelResult').style.display = 'none';

      this.spin(async () => {
        try {
          const result = await API.bookings.spinWheel(bookingId);
          document.getElementById('wheelResult').style.display = 'block';
          document.getElementById('wheelCode').textContent = result.code;
          document.getElementById('wheelResultMsg').textContent = t('wheel_win');
          document.getElementById('wheelAlmost').style.display = 'block';
        } catch (e) {
          document.getElementById('wheelResult').style.display = 'block';
          document.getElementById('wheelResultMsg').textContent = e.message;
        }
      });
    };
  }
};
